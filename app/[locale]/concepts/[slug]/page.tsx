import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KnowledgeArticle } from "@/components/knowledge-article";
import { assertValidContent, getAllConcepts, getConceptBySlug } from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n/config";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

export function generateStaticParams() {
  assertValidContent();
  return locales.flatMap((locale) =>
    getAllConcepts(locale).map((concept) => ({ locale, slug: concept.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const concept = getConceptBySlug(locale, slug);
  if (!concept) return {};
  const availableLocales = locales.filter((availableLocale) =>
    getConceptBySlug(availableLocale, slug),
  );
  return createLocalizedMetadata({
    locale,
    title: concept.title,
    description: concept.description,
    path: `/concepts/${concept.slug}`,
    type: "article",
    availableLocales,
  });
}

export default async function ConceptPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const concept = getConceptBySlug(locale, slug);
  if (!concept) notFound();
  return <KnowledgeArticle concept={concept} locale={locale} />;
}
