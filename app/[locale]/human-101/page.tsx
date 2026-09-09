import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { ConceptCard } from "@/components/concept-card";
import { getCategories } from "@/lib/categories";
import { getHuman101Concepts } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).human101;
  return createLocalizedMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: "/human-101",
  });
}

export default async function Human101Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getDictionary(locale).human101;
  const categories = getCategories(locale);
  const concepts = getHuman101Concepts(locale);

  return (
    <>
      <header className="collection-hero">
        <div className="shell collection-hero-grid">
          <div>
            <p className="eyebrow with-line">{copy.eyebrow}</p>
            <h1>Human <em>101</em></h1>
          </div>
          <div className="collection-intro">
            <BookOpen size={28} strokeWidth={1.3} />
            <p>{copy.intro}</p>
            <a href="#curriculum">{copy.begin} <ArrowDown size={16} /></a>
          </div>
        </div>
        <div className="shell collection-stats">
          <div><strong>{concepts.length}</strong><span>{copy.releaseConcepts}</span></div>
          <div><strong>5</strong><span>{copy.fields}</span></div>
          <div><strong>A–E</strong><span>{copy.evidenceLevels}</span></div>
        </div>
      </header>

      <section className="curriculum-section section-space" id="curriculum">
        <div className="shell curriculum-layout">
          <aside>
            <p className="section-number">{copy.path}</p>
            <h2>{copy.pathTitle}</h2>
            <p>{copy.pathDescription}</p>
            <div className="curriculum-key">
              {categories.map((category) => (
                <a href={`#${category.slug}`} key={category.slug}>
                  <span>{category.index}</span> {category.shortName}
                </a>
              ))}
            </div>
          </aside>
          <div className="curriculum-list">
            {categories.map((category) => {
              const categoryConcepts = concepts.filter((item) => item.category === category.slug);
              if (!categoryConcepts.length) return null;
              return (
                <section id={category.slug} key={category.slug}>
                  <div className="curriculum-category-heading">
                    <span>{category.index}</span>
                    <div><p>{category.eyebrow}</p><h2>{category.name}</h2></div>
                    <p>{category.question}</p>
                  </div>
                  <div>
                    {categoryConcepts.map((concept) => (
                      <ConceptCard
                        concept={concept}
                        locale={locale}
                        index={concept.human_101_order}
                        variant="row"
                        key={concept.slug}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="curriculum-end">
        <div className="shell curriculum-end-inner">
          <Sparkles size={25} strokeWidth={1.3} />
          <p className="eyebrow">{copy.endEyebrow}</p>
          <h2>{copy.endTitle}</h2>
          <p>{copy.endDescription}</p>
          <Link className="button button-primary" href={localizedPath(locale, "/explore")}>
            {copy.explore} <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
