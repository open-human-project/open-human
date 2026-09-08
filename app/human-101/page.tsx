import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { ConceptCard } from "@/components/concept-card";
import { categories } from "@/lib/categories";
import { getHuman101Concepts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Human 101",
  description: "A curated path through the essential ideas every human should understand.",
  alternates: { canonical: "/human-101" },
};

export default function Human101Page() {
  const concepts = getHuman101Concepts();

  return (
    <>
      <header className="collection-hero">
        <div className="shell collection-hero-grid">
          <div>
            <p className="eyebrow with-line">A foundational curriculum</p>
            <h1>Human <em>101</em></h1>
          </div>
          <div className="collection-intro">
            <BookOpen size={28} strokeWidth={1.3} />
            <p>
              If you learn nothing else about being human, start here: a careful
              sequence of ideas about the organism, the interpreter, and the
              social world.
            </p>
            <a href="#curriculum">Begin with concept 01 <ArrowDown size={16} /></a>
          </div>
        </div>
        <div className="shell collection-stats">
          <div><strong>{concepts.length}</strong><span>concepts in release 0.1</span></div>
          <div><strong>5</strong><span>fields of understanding</span></div>
          <div><strong>A–E</strong><span>visible evidence levels</span></div>
        </div>
      </header>

      <section className="curriculum-section section-space" id="curriculum">
        <div className="shell curriculum-layout">
          <aside>
            <p className="section-number">The path</p>
            <h2>One idea opens the next.</h2>
            <p>
              Read in order or enter anywhere. This is a map, not a commandment.
            </p>
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
          <p className="eyebrow">Not a finish line</p>
          <h2>Understanding is a practice.</h2>
          <p>
            Notice what these concepts change in ordinary life. Question them.
            Follow the evidence. Return when experience gives you a better question.
          </p>
          <Link className="button button-primary" href="/explore">
            Explore the full library <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
