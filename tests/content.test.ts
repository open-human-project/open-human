import { describe, expect, it } from "vitest";
import {
  getAllConcepts,
  getConceptsByCategory,
  getHuman101Concepts,
  getSearchDocuments,
  validateContentGraph,
} from "@/lib/content";
import { categories } from "@/lib/categories";
import { rankSearchDocuments } from "@/lib/search";

describe("knowledge library", () => {
  it("loads a complete 15-concept foundation release", () => {
    const concepts = getAllConcepts();
    expect(concepts.length).toBeGreaterThanOrEqual(15);
    expect(new Set(concepts.map((concept) => concept.slug)).size).toBe(concepts.length);
  });

  it("has a continuous Human 101 curriculum", () => {
    const concepts = getHuman101Concepts();
    expect(concepts.length).toBeGreaterThanOrEqual(15);
    expect(concepts.map((concept) => concept.human_101_order)).toEqual(
      Array.from({ length: concepts.length }, (_, index) => index + 1),
    );
  });

  it("has content in every public category", () => {
    for (const category of categories) {
      expect(getConceptsByCategory(category.slug).length).toBeGreaterThan(0);
    }
  });

  it("has no broken concept relationships", () => {
    expect(validateContentGraph()).toEqual([]);
  });
});

describe("weighted natural-language search", () => {
  const documents = getSearchDocuments();

  it.each([
    ["How does sleep work?", "sleep"],
    ["Why is my memory unreliable?", "reconstructive-memory"],
    ["What is confirmation bias?", "confirmation-bias"],
    ["How does manipulation work?", "manipulation"],
  ])("maps %s to a relevant concept", (query, expectedSlug) => {
    const result = rankSearchDocuments(documents, query)[0];
    expect(result?.document.slug).toBe(expectedSlug);
  });

  it("maps group-following language to conformity or groupthink", () => {
    const result = rankSearchDocuments(documents, "Why do people follow groups?")[0];
    expect(["conformity", "groupthink"]).toContain(result?.document.slug);
  });

  it.each([
    ["adenosine", "sleep"],
    ["soreness", "exercise-adaptation"],
    ["mitochondrial", "exercise-adaptation"],
  ])("finds a term that appears only in the article body: %s", (query, expectedSlug) => {
    const result = rankSearchDocuments(documents, query)[0];
    expect(result?.document.slug).toBe(expectedSlug);
  });

  it("does not match short stopwords as substrings", () => {
    expect(rankSearchDocuments(documents, "in")).toEqual([]);
    expect(rankSearchDocuments(documents, "AI")).toEqual([]);
  });

  it("respects the category filter", () => {
    const results = rankSearchDocuments(documents, "attention", "mind");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(({ document }) => document.category === "mind")).toBe(true);
  });
});
