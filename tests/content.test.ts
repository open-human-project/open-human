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

const human101Slugs = [
  "sleep",
  "energy-balance",
  "hydration",
  "nutrition-patterns",
  "stress-response",
  "exercise-adaptation",
  "perception-is-inference",
  "attention",
  "reconstructive-memory",
  "emotion-and-judgment",
  "confirmation-bias",
  "habits-and-context",
  "event-and-interpretation",
  "emotion-regulation",
  "metacognition",
  "reflection-and-rumination",
  "avoidance-and-reinforcement",
  "impulse-action-consequence",
  "social-identity",
  "status",
  "conformity",
  "cooperation-and-collective-action",
  "reciprocity",
  "competition",
  "manipulation",
  "scams-and-social-engineering",
  "coercive-control",
  "propaganda",
  "groupthink",
  "dehumanization",
] as const;

describe.each(locales)("%s knowledge library", (locale) => {
  it("loads at least the complete expanded foundation", () => {
    const concepts = getAllConcepts(locale);
    const slugs = concepts.map((concept) => concept.slug);
    expect(concepts.length).toBeGreaterThanOrEqual(human101Slugs.length);
    expect(slugs).toEqual(expect.arrayContaining([...human101Slugs]));
    expect(new Set(slugs).size).toBe(concepts.length);
    expect(concepts.every((concept) => concept.locale === locale)).toBe(true);
  });

  it("has a continuous Human 101 curriculum", () => {
    const concepts = getHuman101Concepts(locale);
    expect(concepts.map((concept) => concept.slug)).toEqual(human101Slugs);
    expect(concepts.map((concept) => concept.human_101_order)).toEqual(
      Array.from({ length: human101Slugs.length }, (_, index) => index + 1),
    );
  });

  it("keeps six Human 101 concepts in every public category", () => {
    const human101 = getHuman101Concepts(locale);
    for (const category of getCategories(locale)) {
      expect(getConceptsByCategory(locale, category.slug).length).toBeGreaterThanOrEqual(6);
      expect(human101.filter((concept) => concept.category === category.slug)).toHaveLength(6);
    }
  });

  it("has no broken concept relationships or article structure", () => {
    expect(validateContentGraph(locale)).toEqual([]);
  });

  it("maps every concept's primary reader question back to that concept", () => {
    const documents = getSearchDocuments(locale);
    for (const document of documents) {
      const result = rankSearchDocuments(documents, document.aliases[0], locale)[0];
      expect(result?.document.slug, document.aliases[0]).toBe(document.slug);
    }
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
      ["Why do people favor their own group?", "social-identity"],
      ["Does competition improve performance?", "competition"],
      ["Why does avoidance become a habit?", "avoidance-and-reinforcement"],
      ["How can I regulate my emotions?", "emotion-regulation"],
      ["Why am I thirsty?", "hydration"],
      ["How does diet shape health?", "nutrition-patterns"],
      ["Why does stress affect my body?", "stress-response"],
      ["Why can seeing be mistaken?", "perception-is-inference"],
      ["Why do routines feel automatic?", "habits-and-context"],
      ["Am I overthinking?", "reflection-and-rumination"],
      ["How does teamwork solve shared problems?", "cooperation-and-collective-action"],
      ["How do phishing scams create urgency?", "scams-and-social-engineering"],
      ["How can I recognize controlling behavior?", "coercive-control"],
      ["Can misinformation be propaganda?", "propaganda"],
      ["How does dehumanizing language work?", "dehumanization"],
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
      ["Mengapa orang memihak kelompoknya sendiri?", "social-identity"],
      ["Apakah persaingan meningkatkan kinerja?", "competition"],
      ["Mengapa penghindaran dapat menjadi kebiasaan?", "avoidance-and-reinforcement"],
      ["Bagaimana cara mengatur emosi?", "emotion-regulation"],
      ["Mengapa saya merasa haus?", "hydration"],
      ["Bagaimana makanan membentuk kesehatan?", "nutrition-patterns"],
      ["Bagaimana stres memengaruhi tubuh?", "stress-response"],
      ["Mengapa hal yang saya lihat bisa keliru?", "perception-is-inference"],
      ["Mengapa rutinitas terasa otomatis?", "habits-and-context"],
      ["Apakah saya overthinking?", "reflection-and-rumination"],
      ["Bagaimana kerja sama membantu kelompok?", "cooperation-and-collective-action"],
      ["Bagaimana cara mengenali penipu?", "scams-and-social-engineering"],
      ["Bagaimana mengenali pasangan yang mengekang?", "coercive-control"],
      ["Apakah hoaks selalu propaganda?", "propaganda"],
      ["Bagaimana ucapan merendahkan kemanusiaan?", "dehumanization"],
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
