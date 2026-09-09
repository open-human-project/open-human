import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp, GitPullRequest, Scale, ShieldCheck } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

const commitmentIcons = [Scale, CircleHelp, ShieldCheck, GitPullRequest];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).methodology;
  return createLocalizedMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: "/methodology",
  });
}

export default async function MethodologyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getDictionary(locale).methodology;
  return (
    <>
      <header className="page-hero methodology-hero">
        <div className="shell">
          <p className="eyebrow with-line">{copy.eyebrow}</p>
          <div className="page-hero-grid">
            <h1>{copy.headingStart} <em>{copy.headingEmphasis}</em></h1>
            <p>{copy.introduction}</p>
          </div>
        </div>
      </header>

      <section className="method-intro section-space">
        <div className="shell method-intro-grid">
          <p className="section-number">{copy.evidenceNumber}</p>
          <div>
            <h2>{copy.evidenceTitle}</h2>
            <p>{copy.evidenceDescription}</p>
          </div>
        </div>
        <div className="shell evidence-scale">
          {copy.evidenceLevels.map(([level, label, description]) => (
            <div key={level}>
              <span>{level}</span>
              <strong>{label}</strong>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <p className="shell scale-caveat">
          {copy.scaleCaveat}
        </p>
        <div className="shell confidence-guide">
          <div>
            <p className="eyebrow">{copy.signalEyebrow}</p>
            <h3>{copy.confidenceTitle}</h3>
          </div>
          <dl>
            {copy.confidenceLevels.map(([level, description]) => (
              <div key={level}><dt>{level}</dt><dd>{description}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="method-principles section-space">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="section-number light">{copy.commitmentsNumber}</p><h2>{copy.commitmentsTitle}</h2></div>
          </div>
          <div className="method-cards">
            {copy.commitments.map(([title, description], index) => {
              const Icon = commitmentIcons[index];
              return (
                <article key={title}>
                  <Icon size={24} strokeWidth={1.3} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="review-path section-space">
        <div className="shell review-grid">
          <div><p className="section-number">{copy.pathNumber}</p><h2>{copy.pathTitle}</h2></div>
          <ol>
            {copy.steps.map(([title, description], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{title}</strong><p>{description}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="shell methodology-cta">
          <p>{copy.seePractice}</p>
          <Link href={localizedPath(locale, "/human-101")}>{copy.beginHuman101} <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
