import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, GitFork } from "lucide-react";
import { CategoryGlyph } from "@/components/category-glyph";
import { ConceptCard } from "@/components/concept-card";
import { HeroMap } from "@/components/hero-map";
import { SearchForm } from "@/components/search-form";
import { getCategories } from "@/lib/categories";
import { getHuman101Concepts } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).home;
  return createLocalizedMetadata({ locale, title: copy.title, description: copy.description });
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const copy = dictionary.home;
  const categories = getCategories(locale);
  const human101 = getHuman101Concepts(locale);
  const conceptsBySlug = new Map(human101.map((concept) => [concept.slug, concept]));
  const selectConcepts = (slugs: string[]) =>
    slugs.map((slug) => {
      const concept = conceptsBySlug.get(slug);
      if (!concept) throw new Error(`Homepage selection references missing concept: ${slug}`);
      return concept;
    });
  const featured = selectConcepts([
    "homeostasis-and-feedback",
    "perception-is-inference",
    "event-and-interpretation",
    "social-identity",
  ]);
  const librarySelections = selectConcepts([
    "pain-and-protection",
    "learning-through-retrieval-and-spacing",
    "attraction-and-compatibility",
  ]);
  const contributionHref =
    siteConfig.repositoryUrl ?? localizedPath(locale, "/about#contribute");

  return (
    <>
      <section className="home-hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow with-line">{copy.heroEyebrow}</p>
            <h1>
              {copy.heroLineOne}
              <br />
              <em>{copy.heroLineTwo}</em>
            </h1>
            <p className="hero-intro">{copy.heroIntro}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href={localizedPath(locale, "/human-101")}>
                {copy.startHuman101} <ArrowRight size={17} />
              </Link>
              <Link className="text-link" href={localizedPath(locale, "/explore")}>
                {copy.exploreLibrary} <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          <HeroMap locale={locale} />
        </div>
        <div className="shell hero-index" aria-hidden="true">
          {copy.heroIndex.map((label) => <span key={label}>{label}</span>)}
        </div>
      </section>

      <section className="question-section">
        <div className="shell narrow-shell">
          <div className="section-heading centered-heading">
            <p className="eyebrow">{copy.questionEyebrow}</p>
            <h2>{copy.questionTitle}</h2>
            <p>{copy.questionDescription}</p>
          </div>
          <SearchForm copy={dictionary.search} locale={locale} />
          <div className="sample-questions">
            <span>{copy.tryAsking}</span>
            {copy.sampleQuestions.map(({ label, query }) => (
              <Link href={`${localizedPath(locale, "/search")}#${encodeURIComponent(query)}`} key={query}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section section-space">
        <div className="shell why-grid">
          <div>
            <p className="section-number">{copy.whyNumber}</p>
          </div>
          <div className="why-copy">
            <h2>{copy.whyTitle}</h2>
            <div className="why-columns">
              {copy.whyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="library-section section-space">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="section-number">{copy.exploreNumber}</p>
              <h2>{copy.exploreTitle}</h2>
            </div>
            <p>{copy.exploreDescription}</p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                className={`category-tile accent-${category.accent}`}
                href={localizedPath(locale, `/explore/${category.slug}`)}
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
            <p className="section-number light">{copy.essentialsNumber}</p>
            <div className="preview-icon">
              <BookOpen size={26} strokeWidth={1.35} />
            </div>
            <h2>{copy.curriculumTitle}</h2>
            <p className="preview-lede">{copy.curriculumLede}</p>
            <p className="preview-note">{copy.curriculumNote}</p>
            <Link className="button button-light" href={localizedPath(locale, "/human-101")}>
              {copy.fullCurriculum} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="preview-list">
            {featured.map((concept, index) => (
              <Link href={localizedPath(locale, `/concepts/${concept.slug}`)} key={concept.slug}>
                <span>{String(concept.human_101_order ?? index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{categories.find((category) => category.slug === concept.category)?.name}</small>
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
              <p className="section-number">{copy.libraryNumber}</p>
              <h2>{copy.concreteTitle}</h2>
            </div>
            <Link className="text-link" href={localizedPath(locale, "/explore")}>
              {copy.browseAll} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="concept-card-grid">
            {librarySelections.map((concept) => (
              <ConceptCard concept={concept} locale={locale} key={concept.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="principles-section">
        <div className="shell principles-grid">
          {copy.principles.map((principle, index) => (
            <div className="principle" key={principle.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contribute-section section-space">
        <div className="shell contribute-card">
          <div className="contribute-mark" aria-hidden="true">
            <GitFork size={34} strokeWidth={1.1} />
          </div>
          <div>
            <p className="eyebrow">{copy.contributeEyebrow}</p>
            <h2>{copy.contributeTitle}</h2>
          </div>
          <div className="contribute-copy">
            <p>{copy.contributeDescription}</p>
            <a
              className="text-link"
              href={contributionHref}
              target={siteConfig.repositoryUrl ? "_blank" : undefined}
              rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
            >
              {copy.improveProject} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
