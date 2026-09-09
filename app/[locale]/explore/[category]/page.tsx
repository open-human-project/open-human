import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { CategoryGlyph } from "@/components/category-glyph";
import { ConceptCard } from "@/components/concept-card";
import { categories, getCategories, getCategory } from "@/lib/categories";
import { getConceptsByCategory } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; category: string }> }): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = getCategory(locale, slug);
  if (!category) return {};
  return createLocalizedMetadata({
    locale,
    title: category.name,
    description: category.description,
    path: `/explore/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: Locale; category: string }> }) {
  const { locale, category: slug } = await params;
  const copy = getDictionary(locale).categoryPage;
  const localizedCategories = getCategories(locale);
  const category = getCategory(locale, slug);
  if (!category) notFound();
  const concepts = getConceptsByCategory(locale, category.slug);
  const currentIndex = localizedCategories.findIndex((item) => item.slug === category.slug);
  const nextCategory = localizedCategories[(currentIndex + 1) % localizedCategories.length];

  return (
    <>
      <header className={`category-hero accent-${category.accent}`}>
        <div className="shell category-breadcrumb">
          <Link href={localizedPath(locale, "/explore")}><ArrowLeft size={14} /> {copy.allFields}</Link>
          <span>{category.index} / 05</span>
        </div>
        <div className="shell category-hero-grid">
          <div className="category-hero-glyph"><CategoryGlyph category={category.slug} /></div>
          <div>
            <p className="eyebrow">{category.eyebrow}</p>
            <h1>{category.name}</h1>
            <p>{category.introduction}</p>
          </div>
          <blockquote>“{category.question}”</blockquote>
        </div>
      </header>

      <section className="category-concepts section-space">
        <div className="shell category-content-grid">
          <aside>
            <p className="section-number">{copy.inField}</p>
            <strong>{String(concepts.length).padStart(2, "0")}</strong>
            <span>{copy.foundationalConcepts}</span>
          </aside>
          <div>
            {concepts.map((concept, index) => (
              <ConceptCard concept={concept} locale={locale} index={index + 1} variant="row" key={concept.slug} />
            ))}
          </div>
        </div>
      </section>

      <aside className="next-field">
        <Link href={localizedPath(locale, `/explore/${nextCategory.slug}`)} className="shell">
          <span><small>{copy.nextField}</small><strong>{nextCategory.name}</strong></span>
          <span>{nextCategory.description}</span>
          <ArrowRight size={21} />
        </Link>
      </aside>
    </>
  );
}
