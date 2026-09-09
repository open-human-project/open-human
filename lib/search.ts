import type { Locale } from "@/lib/i18n/config";
import type { CategorySlug, SearchDocument } from "@/lib/types";

const stopWords: Record<Locale, Set<string>> = {
  en: new Set([
    "a", "am", "are", "do", "does", "how", "i", "in", "is", "it", "its", "me", "my",
    "of", "on", "or", "and", "for", "from", "people", "human", "humans", "that", "the",
    "this", "to", "with", "what", "why",
  ]),
  id: new Set([
    "ada", "adalah", "akan", "aku", "apa", "apakah", "atau", "bagaimana", "bisa", "dalam",
    "dan", "dapat", "dari", "dengan", "di", "ini", "itu", "kapan", "ke", "ketika", "kita",
    "manusia", "mengapa", "orang", "pada", "saya", "sebuah", "untuk", "yang",
  ]),
};

const expansions: Record<Locale, Record<string, string[]>> = {
  en: {
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
  },
  id: {
    ingat: ["ingatan", "rekonstruktif"],
    mengingat: ["ingatan", "rekonstruktif"],
    kelompok: ["konformitas", "groupthink", "sosial"],
    mengikuti: ["konformitas", "groupthink"],
    ikut: ["konformitas", "groupthink"],
    bias: ["konfirmasi", "prasangka"],
    lelah: ["tidur", "perhatian"],
    membujuk: ["manipulasi", "pengaruh"],
    kendali: ["manipulasi", "pemaksaan"],
    olahraga: ["latihan", "adaptasi"],
  },
};

function normalize(value: string, locale: Locale) {
  return value
    .toLocaleLowerCase(locale === "id" ? "id-ID" : "en-US")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function baseQueryTokens(query: string, locale: Locale) {
  const tokens = normalize(query, locale)
    .split(" ")
    .filter(
      (token) =>
        token.length > 2 &&
        (!stopWords[locale].has(token) || Boolean(expansions[locale][token])),
    );
  return [
    ...new Set(
      tokens.flatMap((token) =>
        locale === "en" && token.endsWith("s") ? [token, token.slice(0, -1)] : [token],
      ),
    ),
  ];
}

function wordSet(value: string, locale: Locale) {
  return new Set(normalize(value, locale).split(" ").filter(Boolean));
}

export function scoreSearchDocument(document: SearchDocument, query: string, locale: Locale) {
  const phrase = normalize(query, locale);
  const baseTokens = baseQueryTokens(query, locale);
  const expandedTokens = [
    ...new Set(baseTokens.flatMap((token) => expansions[locale][token] ?? [])),
  ].filter((token) => !baseTokens.includes(token));
  if (!phrase || !baseTokens.length) return 0;

  const title = normalize(document.title, locale);
  const description = normalize(document.description, locale);
  const aliases = normalize(document.aliases.join(" "), locale);
  const tags = normalize(document.tags.join(" "), locale);
  const text = normalize(document.text, locale);
  const titleWords = wordSet(title, locale);
  const descriptionWords = wordSet(description, locale);
  const aliasWords = wordSet(aliases, locale);
  const tagWords = wordSet(tags, locale);
  const bodyWords = wordSet(text, locale);
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
  locale: Locale,
  category: "all" | CategorySlug = "all",
) {
  return documents
    .filter((document) => category === "all" || document.category === category)
    .map((document) => ({ document, score: scoreSearchDocument(document, query, locale) }))
    .filter((result) => !query.trim() || result.score >= 5)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.document.title.localeCompare(b.document.title, locale === "id" ? "id-ID" : "en-US"),
    );
}
