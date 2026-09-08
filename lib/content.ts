import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  categorySlugs,
  evidenceLevels,
  type Concept,
  type SearchDocument,
} from "@/lib/types";

const CONTENT_ROOT = path.join(process.cwd(), "content", "en");

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

const sourceSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(2),
  publisher: z.string().min(2),
  year: z.number().int().min(1800).max(2100),
  url: webUrlSchema,
}).strict();

const frontmatterSchema = z.object({
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
}).strict();

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

function readConcept(filePath: string): Concept {
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

  const contentSection = path.relative(CONTENT_ROOT, filePath).split(path.sep)[0];
  if (contentSection !== parsed.data.category) {
    throw new Error(
      `${path.relative(process.cwd(), filePath)} is stored under \"${contentSection}\" but declares category \"${parsed.data.category}\".`,
    );
  }

  const text = plainText(content);
  const wordCount = text ? text.split(/\s+/).length : 0;

  if (wordCount < 250) {
    throw new Error(`${slug}.mdx is too short (${wordCount} words; minimum 250).`);
  }

  return {
    slug,
    ...parsed.data,
    content,
    wordCount,
    readingMinutes: Math.max(2, Math.ceil(wordCount / 220)),
  };
}

export function getAllConcepts(): Concept[] {
  return findMdxFiles(CONTENT_ROOT)
    .map(readConcept)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getConceptBySlug(slug: string) {
  return getAllConcepts().find((concept) => concept.slug === slug);
}

export function getConceptsByCategory(category: string) {
  return getAllConcepts().filter((concept) => concept.category === category);
}

export function getHuman101Concepts() {
  return getAllConcepts()
    .filter((concept) => concept.human_101_order !== undefined)
    .sort((a, b) => a.human_101_order! - b.human_101_order!);
}

export function getRelatedConcepts(concept: Concept) {
  const bySlug = new Map(getAllConcepts().map((candidate) => [candidate.slug, candidate]));
  return concept.related
    .map((slug) => bySlug.get(slug))
    .filter((candidate): candidate is Concept => candidate !== undefined);
}

export function getSearchDocuments(): SearchDocument[] {
  return getAllConcepts().map((concept) => ({
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
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, " ")
          .split(/\s+/)
          .filter((term) => term.length > 2),
      ),
    ].join(" "),
  }));
}

export function validateContentGraph() {
  const concepts = getAllConcepts();
  const slugs = new Set(concepts.map((concept) => concept.slug));
  const errors: string[] = [];

  if (slugs.size !== concepts.length) {
    const seen = new Set<string>();
    for (const concept of concepts) {
      if (seen.has(concept.slug)) errors.push(`Duplicate concept slug: ${concept.slug}`);
      seen.add(concept.slug);
    }
  }

  for (const concept of concepts) {
    for (const relatedSlug of concept.related) {
      if (!slugs.has(relatedSlug)) {
        errors.push(`${concept.slug}: related concept \"${relatedSlug}\" does not exist`);
      }
      if (relatedSlug === concept.slug) {
        errors.push(`${concept.slug}: cannot relate to itself`);
      }
    }

    const headings = [...concept.content.matchAll(/^##\s+(.+)$/gm)].map((match) =>
      match[1].replace(/[*_`]/g, "").trim(),
    );
    const requiredHeadings = [
      "The short version",
      "Why it matters",
      "How it works",
      "A concrete example",
      "Common misconceptions",
      "What remains uncertain",
    ];
    for (const heading of requiredHeadings) {
      if (!headings.includes(heading)) errors.push(`${concept.slug}: missing required heading \"${heading}\"`);
    }
    if (!headings.includes("What to do with this") && !headings.includes("How to protect yourself")) {
      errors.push(`${concept.slug}: missing a practical response section`);
    }
    if (concept.category === "dark-library" && !headings.includes("How to recognize it")) {
      errors.push(`${concept.slug}: Dark Library pages require \"How to recognize it\"`);
    }

    const headingIds = headings.map((heading) =>
      heading.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-"),
    );
    if (new Set(headingIds).size !== headingIds.length) {
      errors.push(`${concept.slug}: duplicate heading anchor`);
    }

    if (!concept.sources.some((source) => concept.content.includes(source.url))) {
      errors.push(`${concept.slug}: no listed source is cited in the article body`);
    }
  }

  const orders = concepts
    .map((concept) => concept.human_101_order)
    .filter((order): order is number => order !== undefined);
  const duplicates = orders.filter((order, index) => orders.indexOf(order) !== index);
  if (duplicates.length) {
    errors.push(`Duplicate Human 101 order: ${[...new Set(duplicates)].join(", ")}`);
  }

  return errors;
}

export function assertValidContentGraph() {
  const errors = validateContentGraph();
  if (errors.length) {
    throw new Error(`Invalid content graph:\n- ${errors.join("\n- ")}`);
  }
}
