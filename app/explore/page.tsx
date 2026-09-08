import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CategoryGlyph } from "@/components/category-glyph";
import { ConceptCard } from "@/components/concept-card";
import { categories } from "@/lib/categories";
import { getAllConcepts, getConceptsByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Explore the Library",
  description: "Explore Open Human by field, question, or connected concept.",
};

export default function ExplorePage() {
  const concepts = getAllConcepts();
  const startingPoints = ["sleep", "confirmation-bias", "manipulation"].flatMap((slug) => {
    const concept = concepts.find((item) => item.slug === slug);
    return concept ? [concept] : [];
  });

  return (
    <>
      <header className="page-hero library-hero">
        <div className="shell">
          <p className="eyebrow with-line">The knowledge library</p>
          <div className="page-hero-grid">
            <h1>Explore what it means to be <em>human.</em></h1>
            <div>
              <p>
                Begin with a field, then follow connections. Bodies shape minds;
                minds interpret groups; groups shape behavior.
              </p>
              <Link href="/search">Or search with a question <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </header>

      <section className="explore-categories section-space">
        <div className="shell explore-category-list">
          {categories.map((category) => {
            const categoryConcepts = getConceptsByCategory(category.slug);
            return (
              <Link href={`/explore/${category.slug}`} key={category.slug}>
                <span className="explore-number">{category.index}</span>
                <div className="explore-glyph"><CategoryGlyph category={category.slug} /></div>
                <div className="explore-copy">
                  <p>{category.eyebrow}</p>
                  <h2>{category.name}</h2>
                  <span>{category.description}</span>
                </div>
                <div className="explore-count">
                  <strong>{String(categoryConcepts.length).padStart(2, "0")}</strong>
                  <span>concepts</span>
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
            <div><p className="section-number">Across the map</p><h2>Three starting points.</h2></div>
            <p>These concepts reveal the connective tissue of the library.</p>
          </div>
          <div className="concept-card-grid">
            {startingPoints.map((concept) => <ConceptCard concept={concept} key={concept.slug} />)}
          </div>
        </div>
      </section>
    </>
  );
}
