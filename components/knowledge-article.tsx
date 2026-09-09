import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronDown, Github } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { EvidenceBadge } from "@/components/evidence-badge";
import { getCategory } from "@/lib/categories";
import { getHuman101Concepts, getRelatedConcepts } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";
import type { Concept } from "@/lib/types";

function headingId(value: React.ReactNode) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function getHeadings(content: string) {
  return [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    text: match[1].replace(/[*_`]/g, ""),
    id: headingId(match[1].replace(/[*_`]/g, "")),
  }));
}

const mdxComponents = {
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 id={headingId(children)}>{children}</h2>
  ),
  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 id={headingId(children)}>{children}</h3>
  ),
  a: ({ href = "", children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const external = href.startsWith("http");
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {children}
      </a>
    );
  },
};

export function KnowledgeArticle({ concept, locale }: { concept: Concept; locale: Locale }) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.article;
  const category = getCategory(locale, concept.category)!;
  const headings = getHeadings(concept.content);
  const related = getRelatedConcepts(locale, concept);
  const curriculum = getHuman101Concepts(locale);
  const curriculumIndex = curriculum.findIndex((item) => item.slug === concept.slug);
  const previous = curriculumIndex > 0 ? curriculum[curriculumIndex - 1] : undefined;
  const next = curriculumIndex >= 0 ? curriculum[curriculumIndex + 1] : undefined;
  const dateFormatter = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "medium",
  });
  const formattedLastReviewed = dateFormatter.format(
    new Date(`${concept.last_reviewed}T12:00:00Z`),
  );
  const contributionUrl = siteConfig.repositoryUrl
    ? `${siteConfig.repositoryUrl}/edit/main/content/${locale}/${concept.category}/${concept.slug}.mdx`
    : localizedPath(locale, "/about#contribute");

  return (
    <article>
      <header className="article-hero">
        <div className="shell article-breadcrumb">
          <Link href={localizedPath(locale, "/explore")}>{copy.library}</Link>
          <span>/</span>
          <Link href={localizedPath(locale, `/explore/${category.slug}`)}>{category.name}</Link>
          <span>/</span>
          <span>{concept.title}</span>
        </div>
        <div className="shell article-hero-grid">
          <div className="article-marker">
            <span>{category.index}</span>
            <span>{category.eyebrow}</span>
          </div>
          <div className="article-title">
            {concept.human_101_order && (
              <p className="article-collection">
                <BookOpen size={13} /> Human 101 · {String(concept.human_101_order).padStart(2, "0")}
              </p>
            )}
            <h1>{concept.title}</h1>
            <p>{concept.description}</p>
          </div>
          <div className="article-meta-summary">
            <EvidenceBadge level={concept.evidence_level} locale={locale} detailed />
            <div>
              <span>{copy.readingTime}</span>
              <strong>{concept.readingMinutes} {dictionary.common.minutes}</strong>
            </div>
            <div>
              <span>{copy.difficulty}</span>
              <strong>{copy.difficultyLabels[concept.difficulty]}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="shell article-layout">
        <aside className="article-toc" aria-label={copy.onThisPage}>
          <p>{copy.onThisPage}</p>
          <ol>
            {headings.map((heading, index) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="article-main">
          <details className="mobile-article-toc">
            <summary>
              <span>{copy.onThisPage} · {headings.length} {copy.sections}</span>
              <ChevronDown size={17} />
            </summary>
            <ol>
              {headings.map((heading, index) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          {concept.category === "body" && (
            <div className="safety-note">
              <strong>{copy.healthTitle}</strong>
              <p>{copy.healthDescription}</p>
            </div>
          )}
          {concept.category === "dark-library" && (
            <div className="safety-note dark-note">
              <strong>{copy.defenseTitle}</strong>
              <p>{copy.defenseDescription}</p>
            </div>
          )}
          {locale === "id" && (
            <div className="safety-note translation-note">
              <strong>{copy.translationNoteTitle}</strong>
              <p>{copy.translationNote}</p>
              {concept.translation_reviewed_at && (
                <small>
                  {copy.translationReviewed}:{" "}
                  {dateFormatter.format(
                    new Date(`${concept.translation_reviewed_at}T12:00:00Z`),
                  )}
                </small>
              )}
            </div>
          )}
          <div className="article-body">
            <MDXRemote source={concept.content} components={mdxComponents} />
          </div>

          <section className="evidence-panel" aria-labelledby="evidence-heading">
            <div className="evidence-panel-heading">
              <p className="eyebrow">{copy.evidenceProfile}</p>
              <h2 id="evidence-heading">{copy.certaintyTitle}</h2>
            </div>
            <div className="evidence-facts">
              <div>
                <span>{copy.overallEvidence}</span>
                <strong>{copy.level} {concept.evidence_level} · {dictionary.evidence.labels[concept.evidence_level]}</strong>
              </div>
              <div>
                <span>{copy.confidence}</span>
                <strong>{copy.confidenceLabels[concept.confidence]}</strong>
              </div>
              <div>
                <span>{copy.lastReviewed}</span>
                <strong>{formattedLastReviewed}</strong>
              </div>
            </div>
            <p className="evidence-caveat">
              {copy.evidenceCaveat}
            </p>
          </section>

          <section className="sources-section" aria-labelledby="sources-heading">
            <div className="sources-heading">
              <div>
                <p className="eyebrow">{copy.returnEvidence}</p>
                <h2 id="sources-heading">{copy.sources}</h2>
              </div>
              <span>{concept.sources.length} {copy.references}</span>
            </div>
            <ol>
              {concept.sources.map((source, index) => (
                <li key={`${source.url}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title} <ArrowUpRight size={13} />
                    </a>
                    <p>
                      {source.author} · {source.publisher} · {source.year}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="article-review-line">
            <span><CalendarDays size={14} /> {copy.reviewed} {formattedLastReviewed}</span>
            <a
              href={contributionUrl}
              target={siteConfig.repositoryUrl ? "_blank" : undefined}
              rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
            >
              <Github size={14} /> {copy.improve}
            </a>
          </div>
        </div>
      </div>

      <section className="related-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="section-number">{copy.continue}</p>
              <h2>{copy.related}</h2>
            </div>
            <p>{copy.relatedDescription}</p>
          </div>
          <div className="related-grid">
            {related.map((item, index) => (
              <Link href={localizedPath(locale, `/concepts/${item.slug}`)} key={item.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{getCategory(locale, item.category)?.name}</small>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <ArrowUpRight size={18} strokeWidth={1.4} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {(previous || next) && (
        <nav className="curriculum-nav shell" aria-label={copy.curriculumNav}>
          {previous ? (
            <Link href={localizedPath(locale, `/concepts/${previous.slug}`)} className="previous">
              <ArrowLeft size={18} />
              <span><small>{copy.previous}</small><strong>{previous.title}</strong></span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={localizedPath(locale, `/concepts/${next.slug}`)} className="next">
              <span><small>{copy.next}</small><strong>{next.title}</strong></span>
              <ArrowRight size={18} />
            </Link>
          ) : <span />}
        </nav>
      )}
    </article>
  );
}
