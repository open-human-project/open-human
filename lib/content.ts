import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { locales, type Locale } from "@/lib/i18n/config";
import {
  categorySlugs,
  evidenceLevels,
  type Concept,
  type SearchDocument,
} from "@/lib/types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const webUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  }, "Source URLs must use http or https");

const uniqueStrings = (minimum: number) =>
  z
    .array(z.string().min(2))
    .min(minimum)
    .refine(
      (items) => new Set(items.map((item) => item.trim().toLowerCase())).size === items.length,
      "Values must be unique",
    );

const sourceSchema = z
  .object({
    title: z.string().min(3),
    author: z.string().min(2),
    publisher: z.string().min(2),
    year: z.number().int().min(1800).max(2100),
    url: webUrlSchema,
  })
  .strict();

const frontmatterSchema = z
  .object({
    locale: z.enum(locales),
    content_revision: z.number().int().positive().optional(),
    translation_of: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    translation_status: z.enum(["draft", "review", "published"]).optional(),
    source_revision: z.number().int().positive().optional(),
    translation_method: z.enum(["human", "ai-assisted"]).optional(),
    translation_reviewed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    title: z.string().min(3),
    description: z.string().min(20).max(220),
    category: z.enum(categorySlugs),
    tags: uniqueStrings(2),
    aliases: uniqueStrings(1),
    difficulty: z.enum(["foundational", "intermediate", "advanced"]),
    evidence_level: z.enum(evidenceLevels),
    confidence: z.enum(["high", "moderate", "low"]),
    last_reviewed: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => {
        const date = new Date(`${value}T00:00:00Z`);
        return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
      }, "Must be a valid calendar date"),
    human_101_order: z.number().int().positive().optional(),
    related: z
      .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .min(1)
      .refine((items) => new Set(items).size === items.length, "Related slugs must be unique"),
    sources: z
      .array(sourceSchema)
      .min(1)
      .refine(
        (sources) => new Set(sources.map((source) => source.url)).size === sources.length,
        "Source URLs must be unique",
      ),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.locale === "en") {
      if (!value.content_revision) {
        context.addIssue({ code: "custom", path: ["content_revision"], message: "English sources require a content revision" });
      }
      for (const field of ["translation_of", "translation_status", "source_revision", "translation_method", "translation_reviewed_at"] as const) {
        if (value[field] !== undefined) {
          context.addIssue({ code: "custom", path: [field], message: "English sources must not declare translation metadata" });
        }
      }
    } else {
      for (const field of ["translation_of", "translation_status", "source_revision", "translation_method", "translation_reviewed_at"] as const) {
        if (value[field] === undefined) {
          context.addIssue({ code: "custom", path: [field], message: "Localized editions require translation metadata" });
        }
      }
      if (value.content_revision !== undefined) {
        context.addIssue({ code: "custom", path: ["content_revision"], message: "Localized editions track the source revision instead" });
      }
    }
  });

const requiredHeadings: Record<Locale, string[]> = {
  en: [
    "The short version",
    "Why it matters",
    "How it works",
    "A concrete example",
    "Common misconceptions",
    "What remains uncertain",
  ],
  id: [
    "Ringkasnya",
    "Mengapa ini penting",
    "Cara kerjanya",
    "Contoh konkret",
    "Kesalahpahaman umum",
    "Hal yang masih belum pasti",
  ],
};

const practicalHeadings: Record<Locale, string[]> = {
  en: ["What to do with this", "How to protect yourself"],
  id: ["Apa yang dapat dilakukan", "Cara melindungi diri"],
};

const recognitionHeading: Record<Locale, string> = {
  en: "How to recognize it",
  id: "Cara mengenalinya",
};

function findMdxFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMdxFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [fullPath] : [];
  });
}

function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[>#*_~|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readConcept(filePath: string, expectedLocale: Locale): Concept {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), filePath)}:\n${z.prettifyError(parsed.error)}`,
    );
  }

  const slug = path.basename(filePath, ".mdx");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${slug}.mdx does not use a valid kebab-case slug.`);
  }

  const localeRoot = path.join(CONTENT_ROOT, expectedLocale);
  const contentSection = path.relative(localeRoot, filePath).split(path.sep)[0];
  if (contentSection !== parsed.data.category) {
    throw new Error(
      `${path.relative(process.cwd(), filePath)} is stored under "${contentSection}" but declares category "${parsed.data.category}".`,
    );
  }
  if (parsed.data.locale !== expectedLocale) {
    throw new Error(
      `${path.relative(process.cwd(), filePath)} declares locale "${parsed.data.locale}" but is stored under "${expectedLocale}".`,
    );
  }
  if (expectedLocale === "id" && parsed.data.translation_of !== slug) {
    throw new Error(`${path.relative(process.cwd(), filePath)} must declare translation_of: ${slug}.`);
  }

  const text = plainText(content);
  const wordCount = text ? text.split(/\s+/).length : 0;

  if (wordCount < 650) {
    throw new Error(`${slug}.mdx is too short (${wordCount} words; minimum 650).`);
  }

  return {
    slug,
    ...parsed.data,
    content,
    wordCount,
    readingMinutes: Math.max(2, Math.ceil(wordCount / (expectedLocale === "id" ? 200 : 220))),
  };
}

function getAllEditions(locale: Locale) {
  return findMdxFiles(path.join(CONTENT_ROOT, locale))
    .map((filePath) => readConcept(filePath, locale))
    .sort((a, b) => a.title.localeCompare(b.title, locale === "id" ? "id-ID" : "en-US"));
}

export function getAllConcepts(locale: Locale): Concept[] {
  return getAllEditions(locale).filter(
    (concept) => concept.locale === "en" || concept.translation_status === "published",
  );
}

export function getConceptBySlug(locale: Locale, slug: string) {
  return getAllConcepts(locale).find((concept) => concept.slug === slug);
}

export function getConceptsByCategory(locale: Locale, category: string) {
  return getAllConcepts(locale).filter((concept) => concept.category === category);
}

export function getHuman101Concepts(locale: Locale) {
  return getAllConcepts(locale)
    .filter((concept) => concept.human_101_order !== undefined)
    .sort((a, b) => a.human_101_order! - b.human_101_order!);
}

export function getRelatedConcepts(locale: Locale, concept: Concept) {
  const bySlug = new Map(getAllConcepts(locale).map((candidate) => [candidate.slug, candidate]));
  return concept.related
    .map((slug) => bySlug.get(slug))
    .filter((candidate): candidate is Concept => candidate !== undefined);
}

export function getSearchDocuments(locale: Locale): SearchDocument[] {
  return getAllConcepts(locale).map((concept) => ({
    slug: concept.slug,
    title: concept.title,
    description: concept.description,
    category: concept.category,
    tags: concept.tags,
    aliases: concept.aliases,
    evidence_level: concept.evidence_level,
    readingMinutes: concept.readingMinutes,
    text: [
      ...new Set(
        plainText(concept.content)
          .toLocaleLowerCase(locale === "id" ? "id-ID" : "en-US")
          .replace(/[^\p{L}\p{N}\s-]/gu, " ")
          .split(/\s+/)
          .filter((term) => term.length > 2),
      ),
    ].join(" "),
  }));
}

export function validateContentGraph(locale: Locale) {
  const concepts = getAllEditions(locale);
  const slugs = new Set(concepts.map((concept) => concept.slug));
  const errors: string[] = [];

  if (slugs.size !== concepts.length) {
    const seen = new Set<string>();
    for (const concept of concepts) {
      if (seen.has(concept.slug)) errors.push(`${locale}: duplicate concept slug: ${concept.slug}`);
      seen.add(concept.slug);
    }
  }

  for (const concept of concepts) {
    for (const relatedSlug of concept.related) {
      if (!slugs.has(relatedSlug)) {
        errors.push(`${locale}/${concept.slug}: related concept "${relatedSlug}" does not exist`);
      }
      if (relatedSlug === concept.slug) {
        errors.push(`${locale}/${concept.slug}: cannot relate to itself`);
      }
    }

    const headings = [...concept.content.matchAll(/^##\s+(.+)$/gm)].map((match) =>
      match[1].replace(/[*_`]/g, "").trim(),
    );
    for (const heading of requiredHeadings[locale]) {
      if (!headings.includes(heading)) {
        errors.push(`${locale}/${concept.slug}: missing required heading "${heading}"`);
      }
    }
    if (!practicalHeadings[locale].some((heading) => headings.includes(heading))) {
      errors.push(`${locale}/${concept.slug}: missing a practical response section`);
    }
    if (concept.category === "dark-library" && !headings.includes(recognitionHeading[locale])) {
      errors.push(`${locale}/${concept.slug}: Dark Library pages require "${recognitionHeading[locale]}"`);
    }

    const headingIds = headings.map((heading) =>
      heading
        .toLocaleLowerCase(locale === "id" ? "id-ID" : "en-US")
        .normalize("NFKD")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-"),
    );
    if (new Set(headingIds).size !== headingIds.length) {
      errors.push(`${locale}/${concept.slug}: duplicate heading anchor`);
    }

    for (const source of concept.sources) {
      if (!concept.content.includes(source.url)) {
        errors.push(
          `${locale}/${concept.slug}: listed source is not cited in the article body: ${source.url}`,
        );
      }
    }
  }

  const orders = concepts
    .map((concept) => concept.human_101_order)
    .filter((order): order is number => order !== undefined);
  const duplicates = orders.filter((order, index) => orders.indexOf(order) !== index);
  if (duplicates.length) {
    errors.push(`${locale}: duplicate Human 101 order: ${[...new Set(duplicates)].join(", ")}`);
  }
  const orderedValues = [...orders].sort((a, b) => a - b);
  const expectedValues = Array.from({ length: orders.length }, (_, index) => index + 1);
  if (JSON.stringify(orderedValues) !== JSON.stringify(expectedValues)) {
    errors.push(`${locale}: Human 101 order must be continuous from 1`);
  }

  return errors;
}

export function validateContentParity() {
  const english = getAllEditions("en");
  const indonesian = getAllEditions("id");
  const enBySlug = new Map(english.map((concept) => [concept.slug, concept]));
  const idBySlug = new Map(indonesian.map((concept) => [concept.slug, concept]));
  const errors: string[] = [];

  for (const concept of english) {
    const translation = idBySlug.get(concept.slug);
    if (!translation) {
      errors.push(`id: missing translation for ${concept.slug}`);
      continue;
    }

    const invariants = [
      "category",
      "difficulty",
      "evidence_level",
      "confidence",
      "last_reviewed",
      "human_101_order",
    ] as const;
    for (const field of invariants) {
      if (translation[field] !== concept[field]) {
        errors.push(`id/${concept.slug}: ${field} does not match the English source`);
      }
    }

    if (JSON.stringify(translation.related) !== JSON.stringify(concept.related)) {
      errors.push(`id/${concept.slug}: related concepts do not match the English source`);
    }
    if (JSON.stringify(translation.sources) !== JSON.stringify(concept.sources)) {
      errors.push(`id/${concept.slug}: source records do not match the English source`);
    }
    const sourceLinks = [...concept.content.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(
      (match) => match[1],
    );
    const translationLinks = [
      ...translation.content.matchAll(/\]\((https?:\/\/[^)]+)\)/g),
    ].map((match) => match[1]);
    if (JSON.stringify(translationLinks) !== JSON.stringify(sourceLinks)) {
      errors.push(`id/${concept.slug}: inline source links do not match the English source`);
    }
    const sourceHeadingCount = [...concept.content.matchAll(/^##\s+/gm)].length;
    const translationHeadingCount = [...translation.content.matchAll(/^##\s+/gm)].length;
    if (translationHeadingCount !== sourceHeadingCount) {
      errors.push(`id/${concept.slug}: section count does not match the English source`);
    }
    if (translation.source_revision !== concept.content_revision) {
      errors.push(`id/${concept.slug}: translation is stale for English revision ${concept.content_revision}`);
    }
  }

  for (const translation of indonesian) {
    if (!enBySlug.has(translation.slug)) {
      errors.push(`id/${translation.slug}: translation has no English source`);
    }
  }

  return errors;
}

export function assertValidContent() {
  const errors = [
    ...locales.flatMap((locale) => validateContentGraph(locale)),
    ...validateContentParity(),
  ];
  if (errors.length) {
    throw new Error(`Invalid localized content:\n- ${errors.join("\n- ")}`);
  }
}
