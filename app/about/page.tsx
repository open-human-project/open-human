import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Why Open Human exists and what it is trying to become.",
};

export default function AboutPage() {
  return (
    <>
      <header className="page-hero about-hero">
        <div className="shell">
          <p className="eyebrow with-line">About the project</p>
          <div className="page-hero-grid">
            <h1>A shared manual for a subject none of us can step <em>outside of.</em></h1>
            <p>
              Open Human is an open knowledge infrastructure for human literacy:
              evidence, frameworks, perspectives, and better questions.
            </p>
          </div>
        </div>
      </header>

      <section className="about-manifesto section-space">
        <div className="shell manifesto-grid">
          <p className="section-number">The premise</p>
          <div>
            <p className="manifesto-lede">
              You inhabit a body, interpret the world through a fallible mind,
              depend on other humans, and move through systems with incentives
              you did not design.
            </p>
            <p>
              Yet knowledge about those realities is scattered across disciplines,
              hidden behind jargon, or repackaged as certainty by people selling an
              answer. Open Human brings the foundations together without pretending
              they form one final worldview.
            </p>
            <p>
              The aim is not to make everyone think the same. It is to help more
              people notice how they think, investigate what they believe, and live
              more consciously with uncertainty.
            </p>
          </div>
        </div>
      </section>

      <section className="not-this-section">
        <div className="shell not-this-grid">
          <div>
            <p className="eyebrow">What it is</p>
            <ul>
              <li>Knowledge base</li><li>Human literacy curriculum</li><li>Evidence-aware encyclopedia</li><li>Philosophical exploration</li><li>Open-source community</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">What it is not</p>
            <ul>
              <li>A therapy replacement</li><li>A life coach</li><li>A doctrine</li><li>A diagnosis platform</li><li>A promise of happiness</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="open-project section-space" id="contribute">
        <div className="shell open-project-grid">
          <div>
            <p className="section-number">Open by design</p>
            <h2>Knowledge should outgrow its original authors.</h2>
          </div>
          <div>
            <p>
              Concepts are stored as Markdown, sources are visible, and changes can
              be reviewed like software. Over time, contributors, editors, and domain
              reviewers can strengthen what no single person could finish alone.
            </p>
            {siteConfig.repositoryUrl ? (
              <a className="button button-primary" href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer">
                View the project on GitHub <ArrowUpRight size={17} />
              </a>
            ) : (
              <p className="repository-note">
                The public repository is not connected yet. Set <code>NEXT_PUBLIC_GITHUB_URL</code>
                when the project is published; every contribution link will update automatically.
              </p>
            )}
            <Link className="text-link" href="/methodology">
              Read the methodology <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="north-star">
        <div className="shell">
          <p className="eyebrow">The north star</p>
          <blockquote>“I understand myself and the world around me better because of this.”</blockquote>
          <p>That is the product.</p>
        </div>
      </section>
    </>
  );
}
