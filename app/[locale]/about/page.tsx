import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).about;
  return createLocalizedMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: "/about",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getDictionary(locale).about;
  return (
    <>
      <header className="page-hero about-hero">
        <div className="shell">
          <p className="eyebrow with-line">{copy.eyebrow}</p>
          <div className="page-hero-grid">
            <h1>{copy.headingStart} <em>{copy.headingEmphasis}</em></h1>
            <p>{copy.introduction}</p>
          </div>
        </div>
      </header>

      <section className="about-manifesto section-space">
        <div className="shell manifesto-grid">
          <p className="section-number">{copy.premise}</p>
          <div>
            {copy.paragraphs.map((paragraph, index) => (
              <p className={index === 0 ? "manifesto-lede" : undefined} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="not-this-section">
        <div className="shell not-this-grid">
          <div>
            <p className="eyebrow">{copy.whatItIs}</p>
            <ul>
              {copy.whatItIsItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow">{copy.whatItIsNot}</p>
            <ul>
              {copy.whatItIsNotItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="open-project section-space" id="contribute">
        <div className="shell open-project-grid">
          <div>
            <p className="section-number">{copy.openByDesign}</p>
            <h2>{copy.openTitle}</h2>
          </div>
          <div>
            <p>{copy.openDescription}</p>
            {siteConfig.repositoryUrl ? (
              <a className="button button-primary" href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer">
                {copy.viewGithub} <ArrowUpRight size={17} />
              </a>
            ) : (
              <p className="repository-note">{copy.repositoryMissing}</p>
            )}
            <Link className="text-link" href={localizedPath(locale, "/methodology")}>
              {copy.readMethodology} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="north-star">
        <div className="shell">
          <p className="eyebrow">{copy.northStar}</p>
          <blockquote>“{copy.northStarQuote}”</blockquote>
          <p>{copy.northStarConclusion}</p>
        </div>
      </section>
    </>
  );
}
