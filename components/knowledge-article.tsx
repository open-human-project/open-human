import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronDown, Github } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { EvidenceBadge, evidenceLabels } from "@/components/evidence-badge";
import { getCategory } from "@/lib/categories";
import { getHuman101Concepts, getRelatedConcepts } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import type { Concept } from "@/lib/types";

function headingId(value: React.ReactNode) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
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

export function KnowledgeArticle({ concept }: { concept: Concept }) {
  const category = getCategory(concept.category)!;
  const headings = getHeadings(concept.content);
  const related = getRelatedConcepts(concept);
  const curriculum = getHuman101Concepts();
  const curriculumIndex = curriculum.findIndex((item) => item.slug === concept.slug);
  const previous = curriculumIndex > 0 ? curriculum[curriculumIndex - 1] : undefined;
  const next = curriculumIndex >= 0 ? curriculum[curriculumIndex + 1] : undefined;
  const contributionUrl = siteConfig.repositoryUrl
    ? `${siteConfig.repositoryUrl}/edit/main/content/en/${concept.category}/${concept.slug}.mdx`
    : "/about#contribute";

  return (
    <article>
      <header className="article-hero">
        <div className="shell article-breadcrumb">
          <Link href="/explore">Library</Link>
          <span>/</span>
          <Link href={`/explore/${category.slug}`}>{category.name}</Link>
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
            <EvidenceBadge level={concept.evidence_level} detailed />
            <div>
              <span>Reading time</span>
              <strong>{concept.readingMinutes} minutes</strong>
            </div>
            <div>
              <span>Difficulty</span>
              <strong>{concept.difficulty}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="shell article-layout">
        <aside className="article-toc" aria-label="On this page">
          <p>On this page</p>
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
              <span>On this page · {headings.length} sections</span>
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
              <strong>Health context</strong>
              <p>
                This page is general education, not medical advice or diagnosis.
                Individual needs and clinical situations vary.
              </p>
            </div>
          )}
          {concept.category === "dark-library" && (
            <div className="safety-note dark-note">
              <strong>Defensive understanding</strong>
              <p>
                This page explains harmful influence so it is easier to recognize
                and resist—not to make exploitation easier.
              </p>
            </div>
          )}
          <div className="article-body">
            <MDXRemote source={concept.content} components={mdxComponents} />
          </div>

          <section className="evidence-panel" aria-labelledby="evidence-heading">
            <div className="evidence-panel-heading">
              <p className="eyebrow">Evidence profile</p>
              <h2 id="evidence-heading">How certain is this?</h2>
            </div>
            <div className="evidence-facts">
              <div>
                <span>Overall evidence</span>
                <strong>Level {concept.evidence_level} · {evidenceLabels[concept.evidence_level]}</strong>
              </div>
              <div>
                <span>Confidence</span>
                <strong>{concept.confidence}</strong>
              </div>
              <div>
                <span>Last reviewed</span>
                <strong>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${concept.last_reviewed}T12:00:00Z`))}</strong>
              </div>
            </div>
            <p className="evidence-caveat">
              This is a page-level evidence profile, not a claim that every study
              agrees. Follow the sources and examine important claims directly.
            </p>
          </section>

          <section className="sources-section" aria-labelledby="sources-heading">
            <div className="sources-heading">
              <div>
                <p className="eyebrow">Return to the evidence</p>
                <h2 id="sources-heading">Sources</h2>
              </div>
              <span>{concept.sources.length} references</span>
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
            <span><CalendarDays size={14} /> Reviewed {concept.last_reviewed}</span>
            <a
              href={contributionUrl}
              target={siteConfig.repositoryUrl ? "_blank" : undefined}
              rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
            >
              <Github size={14} /> Improve this page
            </a>
          </div>
        </div>
      </div>

      <section className="related-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="section-number">Continue exploring</p>
              <h2>Related concepts</h2>
            </div>
            <p>Knowledge becomes more useful when the connections become visible.</p>
          </div>
          <div className="related-grid">
            {related.map((item, index) => (
              <Link href={`/concepts/${item.slug}`} key={item.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{getCategory(item.category)?.name}</small>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <ArrowUpRight size={18} strokeWidth={1.4} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {(previous || next) && (
        <nav className="curriculum-nav shell" aria-label="Human 101 curriculum navigation">
          {previous ? (
            <Link href={`/concepts/${previous.slug}`} className="previous">
              <ArrowLeft size={18} />
              <span><small>Previous in Human 101</small><strong>{previous.title}</strong></span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/concepts/${next.slug}`} className="next">
              <span><small>Next in Human 101</small><strong>{next.title}</strong></span>
              <ArrowRight size={18} />
            </Link>
          ) : <span />}
        </nav>
      )}
    </article>
  );
}
