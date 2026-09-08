import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, GitFork } from "lucide-react";
import { CategoryGlyph } from "@/components/category-glyph";
import { ConceptCard } from "@/components/concept-card";
import { HeroMap } from "@/components/hero-map";
import { SearchForm } from "@/components/search-form";
import { categories } from "@/lib/categories";
import { getHuman101Concepts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const sampleQuestions = [
  ["Why is memory unreliable?", "memory"],
  ["Why do people follow groups?", "follow groups"],
  ["How does sleep work?", "sleep"],
];

export default function Home() {
  const human101 = getHuman101Concepts();
  const featured = human101.slice(0, 4);

  return (
    <>
      <section className="home-hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow with-line">An open knowledge project</p>
            <h1>
              You were born human.
              <br />
              <em>Nobody gave you the manual.</em>
            </h1>
            <p className="hero-intro">
              A growing, evidence-aware library for understanding your body,
              mind, behavior, and the systems you live inside.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/human-101">
                Start with Human 101 <ArrowRight size={17} />
              </Link>
              <Link className="text-link" href="/explore">
                Explore the library <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          <HeroMap />
        </div>
        <div className="shell hero-index" aria-hidden="true">
          <span>Body</span>
          <span>Mind</span>
          <span>Awareness</span>
          <span>Nature</span>
          <span>Influence</span>
        </div>
      </section>

      <section className="question-section">
        <div className="shell narrow-shell">
          <div className="section-heading centered-heading">
            <p className="eyebrow">Begin with a question</p>
            <h2>What are you trying to understand?</h2>
            <p>
              Search for a concept, a pattern, or a question you have quietly
              carried for a while.
            </p>
          </div>
          <SearchForm />
          <div className="sample-questions">
            <span>Try asking</span>
            {sampleQuestions.map(([label, query]) => (
              <Link href={`/search#${encodeURIComponent(query)}`} key={query}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section section-space">
        <div className="shell why-grid">
          <div>
            <p className="section-number">01 / Why this exists</p>
          </div>
          <div className="why-copy">
            <h2>
              We learn to operate machines before we learn to understand
              ourselves.
            </h2>
            <div className="why-columns">
              <p>
                You learned how to use a phone. You learned how to navigate a
                workplace. But perhaps nobody explained how memory changes,
                why groups alter judgment, or how an exhausted body changes a
                decision.
              </p>
              <p>
                Open Human connects reliable knowledge with honest uncertainty.
                It offers explanations and questions—not instructions for how
                everyone should live.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="library-section section-space">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="section-number">02 / Explore humanity</p>
              <h2>Five places to begin.</h2>
            </div>
            <p>
              Human knowledge rarely stays in one category. Follow the links
              between them and build a clearer picture.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                className={`category-tile accent-${category.accent}`}
                href={`/explore/${category.slug}`}
                key={category.slug}
              >
                <div className="category-tile-top">
                  <span>{category.index}</span>
                  <CategoryGlyph category={category.slug} />
                </div>
                <div>
                  <p>{category.eyebrow}</p>
                  <h3>{category.name}</h3>
                  <span className="category-description">{category.description}</span>
                </div>
                <ArrowUpRight className="category-arrow" size={21} strokeWidth={1.4} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="human-preview section-space">
        <div className="shell human-preview-grid">
          <div className="human-preview-intro">
            <p className="section-number light">03 / The essentials</p>
            <div className="preview-icon">
              <BookOpen size={26} strokeWidth={1.35} />
            </div>
            <h2>Human 101</h2>
            <p className="preview-lede">
              A short curriculum of ideas that change how you see your body,
              mind, and other people.
            </p>
            <p className="preview-note">
              If you learn nothing else about being human, start here.
            </p>
            <Link className="button button-light" href="/human-101">
              See the full curriculum <ArrowRight size={17} />
            </Link>
          </div>
          <div className="preview-list">
            {featured.map((concept, index) => (
              <Link href={`/concepts/${concept.slug}`} key={concept.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{concept.category.replace("-", " ")}</small>
                  <strong>{concept.title}</strong>
                  <p>{concept.description}</p>
                </div>
                <ArrowUpRight size={19} strokeWidth={1.3} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="latest-section section-space">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="section-number">04 / From the library</p>
              <h2>Start somewhere concrete.</h2>
            </div>
            <Link className="text-link" href="/explore">
              Browse all concepts <ArrowRight size={15} />
            </Link>
          </div>
          <div className="concept-card-grid">
            {human101.slice(4, 7).map((concept) => (
              <ConceptCard concept={concept} key={concept.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="principles-section">
        <div className="shell principles-grid">
          <div className="principle">
            <span>01</span>
            <h3>No taboo.</h3>
            <p>No human topic is too uncomfortable to understand responsibly.</p>
          </div>
          <div className="principle">
            <span>02</span>
            <h3>No dogma.</h3>
            <p>Understand the evidence and perspectives. Decide consciously.</p>
          </div>
          <div className="principle">
            <span>03</span>
            <h3>Evidence first.</h3>
            <p>Confidence and uncertainty belong beside every important claim.</p>
          </div>
        </div>
      </section>

      <section className="contribute-section section-space">
        <div className="shell contribute-card">
          <div className="contribute-mark" aria-hidden="true">
            <GitFork size={34} strokeWidth={1.1} />
          </div>
          <div>
            <p className="eyebrow">Built in the open</p>
            <h2>Knowledge should be inspectable, revisable, and shared.</h2>
          </div>
          <div className="contribute-copy">
            <p>
              Every concept is stored as a plain-text, inspectable knowledge file.
              Question a claim, improve a source, or make an explanation clearer.
            </p>
            <a
              className="text-link"
              href={siteConfig.contributeHref}
              target={siteConfig.repositoryUrl ? "_blank" : undefined}
              rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
            >
              Improve this project <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
