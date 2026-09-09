import type { Locale } from "@/lib/i18n/config";

export const evidenceLevels = ["A", "B", "C", "D", "E"] as const;
export type EvidenceLevel = (typeof evidenceLevels)[number];

export const categorySlugs = [
  "body",
  "mind",
  "self-awareness",
  "human-nature",
  "dark-library",
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export type Source = {
  title: string;
  author: string;
  publisher: string;
  year: number;
  url: string;
};

export type ConceptFrontmatter = {
  locale: Locale;
  content_revision?: number;
  translation_of?: string;
  translation_status?: "draft" | "review" | "published";
  source_revision?: number;
  translation_method?: "human" | "ai-assisted";
  translation_reviewed_at?: string;
  title: string;
  description: string;
  category: CategorySlug;
  tags: string[];
  aliases: string[];
  difficulty: "foundational" | "intermediate" | "advanced";
  evidence_level: EvidenceLevel;
  confidence: "high" | "moderate" | "low";
  last_reviewed: string;
  human_101_order?: number;
  related: string[];
  sources: Source[];
};

export type Concept = ConceptFrontmatter & {
  slug: string;
  content: string;
  readingMinutes: number;
  wordCount: number;
};

export type SearchDocument = Pick<
  Concept,
  | "slug"
  | "title"
  | "description"
  | "category"
  | "tags"
  | "aliases"
  | "evidence_level"
  | "readingMinutes"
> & {
  text: string;
};
