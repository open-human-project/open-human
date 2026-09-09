import { describe, expect, it } from "vitest";
import { getCategories } from "@/lib/categories";
import {
  getAllConcepts,
  getConceptsByCategory,
  getHuman101Concepts,
  getSearchDocuments,
  validateContentGraph,
  validateContentParity,
} from "@/lib/content";
import {
  localizedAlternates,
  localizedPath,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { rankSearchDocuments } from "@/lib/search";

const foundationSlugs = [
  "attention",
  "confirmation-bias",
  "conformity",
  "emotion-and-judgment",
  "energy-balance",
  "event-and-interpretation",
  "exercise-adaptation",
  "groupthink",
  "impulse-action-consequence",
  "manipulation",
  "metacognition",
  "reciprocity",
  "reconstructive-memory",
  "sleep",
  "status",
] as const;

describe.each(locales)("%s knowledge library", (locale) => {
  it("loads at least the complete foundation release", () => {
    const concepts = getAllConcepts(locale);
    const slugs = concepts.map((concept) => concept.slug);
    expect(concepts.length).toBeGreaterThanOrEqual(foundationSlugs.length);
    expect(slugs).toEqual(expect.arrayContaining([...foundationSlugs]));
    expect(new Set(slugs).size).toBe(concepts.length);
    expect(concepts.every((concept) => concept.locale === locale)).toBe(true);
  });

  it("has a continuous Human 101 curriculum", () => {
    const concepts = getHuman101Concepts(locale);
    expect(concepts.length).toBeGreaterThanOrEqual(foundationSlugs.length);
    expect(concepts.map((concept) => concept.slug)).toEqual(
      expect.arrayContaining([...foundationSlugs]),
    );
    expect(concepts.map((concept) => concept.human_101_order)).toEqual(
      Array.from({ length: concepts.length }, (_, index) => index + 1),
    );
  });

  it("has content in every public category", () => {
    for (const category of getCategories(locale)) {
      expect(getConceptsByCategory(locale, category.slug).length).toBeGreaterThan(0);
    }
  });

  it("has no broken concept relationships or article structure", () => {
    expect(validateContentGraph(locale)).toEqual([]);
  });
});

describe("localized editorial parity", () => {
  it("keeps every Indonesian edition aligned to its English source revision", () => {
    expect(validateContentParity()).toEqual([]);
  });

  it("publishes all Indonesian editions with transparent translation metadata", () => {
    for (const concept of getAllConcepts("id")) {
      expect(concept.translation_of).toBe(concept.slug);
      expect(concept.translation_status).toBe("published");
      expect(concept.translation_method).toBe("ai-assisted");
      expect(concept.translation_reviewed_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(concept.source_revision).toBe(
        getAllConcepts("en").find((source) => source.slug === concept.slug)?.content_revision,
      );
    }
  });

  it("uses explicit locale paths and complete interface dictionaries", () => {
    expect(localizedPath("en")).toBe("/en");
    expect(localizedPath("id")).toBe("/id");
    expect(localizedPath("en", "/concepts/sleep")).toBe("/en/concepts/sleep");
    expect(localizedPath("id", "/concepts/sleep")).toBe("/id/concepts/sleep");
    expect(localizedAlternates("en", "/concepts/sleep", ["en"]).languages).toEqual({
      en: "/en/concepts/sleep",
      "x-default": "/en/concepts/sleep",
    });
    expect(getDictionary("en").navigation.links).toHaveLength(4);
    expect(getDictionary("id").navigation.links).toHaveLength(4);
  });
});

describe("Indonesian search expansion", () => {
  it("keeps an exact kelompok query searchable", () => {
    const results = rankSearchDocuments(getSearchDocuments("id"), "kelompok", "id");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(({ document }) => ["conformity", "groupthink"].includes(document.slug))).toBe(
      true,
    );
  });
});

describe.each([
  {
    locale: "en" as Locale,
    queries: [
      ["How does sleep work?", "sleep"],
      ["Why is my memory unreliable?", "reconstructive-memory"],
      ["What is confirmation bias?", "confirmation-bias"],
      ["How does manipulation work?", "manipulation"],
    ],
    groupQuery: "Why do people follow groups?",
    bodyTerm: "adenosine",
    stopword: "in",
  },
  {
    locale: "id" as Locale,
    queries: [
      ["Bagaimana cara kerja tidur?", "sleep"],
      ["Mengapa ingatan saya berubah?", "reconstructive-memory"],
      ["Apa itu bias konfirmasi?", "confirmation-bias"],
      ["Bagaimana cara mengenali manipulasi?", "manipulation"],
    ],
    groupQuery: "Mengapa orang mengikuti kelompok?",
    bodyTerm: "adenosin",
    stopword: "yang",
  },
])("$locale weighted natural-language search", ({ locale, queries, groupQuery, bodyTerm, stopword }) => {
  const documents = getSearchDocuments(locale);

  it.each(queries)("maps %s to a relevant concept", (query, expectedSlug) => {
    const result = rankSearchDocuments(documents, query, locale)[0];
    expect(result?.document.slug).toBe(expectedSlug);
  });

  it("maps group-following language to conformity or groupthink", () => {
    const result = rankSearchDocuments(documents, groupQuery, locale)[0];
    expect(["conformity", "groupthink"]).toContain(result?.document.slug);
  });

  it("finds a term that appears in the article body", () => {
    const result = rankSearchDocuments(documents, bodyTerm, locale)[0];
    expect(result?.document.slug).toBe("sleep");
  });

  it("does not match stopwords as substrings", () => {
    expect(rankSearchDocuments(documents, stopword, locale)).toEqual([]);
  });

  it("respects the category filter", () => {
    const query = locale === "id" ? "perhatian" : "attention";
    const results = rankSearchDocuments(documents, query, locale, "mind");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(({ document }) => document.category === "mind")).toBe(true);
  });
});
