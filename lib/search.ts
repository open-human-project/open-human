import type { CategorySlug, SearchDocument } from "@/lib/types";

const stopWords = new Set([
  "a",
  "am",
  "are",
  "do",
  "does",
  "how",
  "i",
  "in",
  "is",
  "it",
  "its",
  "me",
  "my",
  "of",
  "on",
  "or",
  "and",
  "for",
  "from",
  "people",
  "human",
  "humans",
  "that",
  "the",
  "this",
  "to",
  "with",
  "what",
  "why",
]);

const expansions: Record<string, string[]> = {
  remember: ["memory", "reconstructive"],
  remembering: ["memory", "reconstructive"],
  groups: ["conformity", "groupthink", "social"],
  group: ["conformity", "groupthink", "social"],
  follow: ["conformity", "groupthink"],
  biased: ["bias", "confirmation"],
  tired: ["sleep", "attention"],
  persuasion: ["manipulation", "influence"],
  control: ["manipulation", "coercion"],
  exercise: ["training", "adaptation"],
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function baseQueryTokens(query: string) {
  const tokens = normalize(query)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
  return [
    ...new Set(tokens.flatMap((token) => [token, ...(token.endsWith("s") ? [token.slice(0, -1)] : [])])),
  ];
}

function wordSet(value: string) {
  return new Set(normalize(value).split(" ").filter(Boolean));
}

export function scoreSearchDocument(document: SearchDocument, query: string) {
  const phrase = normalize(query);
  const baseTokens = baseQueryTokens(query);
  const expandedTokens = [
    ...new Set(baseTokens.flatMap((token) => expansions[token] ?? [])),
  ].filter((token) => !baseTokens.includes(token));
  if (!phrase || !baseTokens.length) return 0;

  const title = normalize(document.title);
  const description = normalize(document.description);
  const aliases = normalize(document.aliases.join(" "));
  const tags = normalize(document.tags.join(" "));
  const text = normalize(document.text);
  const titleWords = wordSet(title);
  const descriptionWords = wordSet(description);
  const aliasWords = wordSet(aliases);
  const tagWords = wordSet(tags);
  const bodyWords = wordSet(text);
  let score = 0;

  if (title === phrase) score += 120;
  if (title.includes(phrase)) score += 55;
  if (aliases.includes(phrase)) score += 48;
  if (description.includes(phrase)) score += 24;

  for (const token of baseTokens) {
    if (titleWords.has(token)) score += 18;
    if (aliasWords.has(token)) score += 10;
    if (tagWords.has(token)) score += 9;
    if (descriptionWords.has(token)) score += 5;
    if (bodyWords.has(token)) score += 5;
  }

  for (const token of expandedTokens) {
    if (titleWords.has(token)) score += 12;
    if (aliasWords.has(token)) score += 8;
    if (tagWords.has(token)) score += 7;
    if (descriptionWords.has(token)) score += 4;
  }

  return score;
}

export function rankSearchDocuments(
  documents: SearchDocument[],
  query: string,
  category: "all" | CategorySlug = "all",
) {
  return documents
    .filter((document) => category === "all" || document.category === category)
    .map((document) => ({ document, score: scoreSearchDocument(document, query) }))
    .filter((result) => !query.trim() || result.score >= 5)
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title));
}
