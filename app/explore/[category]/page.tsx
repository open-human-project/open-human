import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { CategoryGlyph } from "@/components/category-glyph";
import { ConceptCard } from "@/components/concept-card";
import { categories, getCategory } from "@/lib/categories";
import { getConceptsByCategory } from "@/lib/content";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/explore/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const concepts = getConceptsByCategory(category.slug);
  const currentIndex = categories.findIndex((item) => item.slug === category.slug);
  const nextCategory = categories[(currentIndex + 1) % categories.length];

  return (
    <>
      <header className={`category-hero accent-${category.accent}`}>
        <div className="shell category-breadcrumb">
          <Link href="/explore"><ArrowLeft size={14} /> All fields</Link>
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
            <p className="section-number">In this field</p>
            <strong>{String(concepts.length).padStart(2, "0")}</strong>
            <span>foundational concepts</span>
          </aside>
          <div>
            {concepts.map((concept, index) => (
              <ConceptCard concept={concept} index={index + 1} variant="row" key={concept.slug} />
            ))}
          </div>
        </div>
      </section>

      <aside className="next-field">
        <Link href={`/explore/${nextCategory.slug}`} className="shell">
          <span><small>Next field</small><strong>{nextCategory.name}</strong></span>
          <span>{nextCategory.description}</span>
          <ArrowRight size={21} />
        </Link>
      </aside>
    </>
  );
}
