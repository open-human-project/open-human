import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CategoryGlyph } from "@/components/category-glyph";
import { ConceptCard } from "@/components/concept-card";
import { getCategories } from "@/lib/categories";
import { getAllConcepts, getConceptsByCategory } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).explore;
  return createLocalizedMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: "/explore",
  });
}

export default async function ExplorePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getDictionary(locale).explore;
  const categories = getCategories(locale);
  const concepts = getAllConcepts(locale);
  const startingPoints = ["sleep", "confirmation-bias", "manipulation"].flatMap((slug) => {
    const concept = concepts.find((item) => item.slug === slug);
    return concept ? [concept] : [];
  });

  return (
    <>
      <header className="page-hero library-hero">
        <div className="shell">
          <p className="eyebrow with-line">{copy.eyebrow}</p>
          <div className="page-hero-grid">
            <h1>{copy.headingStart} <em>{copy.headingEmphasis}</em></h1>
            <div>
              <p>{copy.introduction}</p>
              <Link href={localizedPath(locale, "/search")}>{copy.searchPrompt} <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </header>

      <section className="explore-categories section-space">
        <div className="shell explore-category-list">
          {categories.map((category) => {
            const categoryConcepts = getConceptsByCategory(locale, category.slug);
            return (
              <Link href={localizedPath(locale, `/explore/${category.slug}`)} key={category.slug}>
                <span className="explore-number">{category.index}</span>
                <div className="explore-glyph"><CategoryGlyph category={category.slug} /></div>
                <div className="explore-copy">
                  <p>{category.eyebrow}</p>
                  <h2>{category.name}</h2>
                  <span>{category.description}</span>
                </div>
                <div className="explore-count">
                  <strong>{String(categoryConcepts.length).padStart(2, "0")}</strong>
                  <span>{copy.countLabel}</span>
                </div>
                <ArrowUpRight className="explore-arrow" size={24} strokeWidth={1.3} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="new-concepts section-space">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="section-number">{copy.mapLabel}</p><h2>{copy.startingTitle}</h2></div>
            <p>{copy.startingDescription}</p>
          </div>
          <div className="concept-card-grid">
            {startingPoints.map((concept) => <ConceptCard concept={concept} locale={locale} key={concept.slug} />)}
          </div>
        </div>
      </section>
    </>
  );
}
