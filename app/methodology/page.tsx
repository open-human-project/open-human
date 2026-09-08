import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp, GitPullRequest, Scale, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How Open Human handles evidence, uncertainty, safety, and revision.",
};

const evidenceLevels = [
  ["A", "Strong evidence", "Multiple high-quality sources or a strong scientific consensus."],
  ["B", "Good evidence", "Reasonably strong evidence with meaningful limitations."],
  ["C", "Emerging or mixed", "Evidence exists, but findings remain uncertain or inconsistent."],
  ["D", "Hypothesis", "A plausible idea without enough evidence for a firm conclusion."],
  ["E", "Interpretive", "A philosophical or interpretive position that evidence alone cannot settle."],
] as const;

export default function MethodologyPage() {
  return (
    <>
      <header className="page-hero methodology-hero">
        <div className="shell">
          <p className="eyebrow with-line">How this library thinks</p>
          <div className="page-hero-grid">
            <h1>Certainty is not the price of <em>understanding.</em></h1>
            <p>
              Good knowledge shows its sources, its limits, and the difference
              between observation and interpretation.
            </p>
          </div>
        </div>
      </header>

      <section className="method-intro section-space">
        <div className="shell method-intro-grid">
          <p className="section-number">01 / Evidence first</p>
          <div>
            <h2>We make the strength of a claim visible.</h2>
            <p>
              Evidence is not a binary stamp of “true” or “false.” Different
              questions permit different kinds of confidence. Each concept gets
              an overall evidence profile, direct links to sources, a review date,
              and an explicit account of what remains uncertain.
            </p>
          </div>
        </div>
        <div className="shell evidence-scale">
          {evidenceLevels.map(([level, label, description]) => (
            <div key={level}>
              <span>{level}</span>
              <strong>{label}</strong>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <p className="shell scale-caveat">
          A page-level rating is a map, not a substitute for reading the underlying research.
        </p>
        <div className="shell confidence-guide">
          <div>
            <p className="eyebrow">A separate signal</p>
            <h3>Confidence describes how firmly this page can state its conclusion.</h3>
          </div>
          <dl>
            <div><dt>High</dt><dd>The central conclusion is stable across strong, relevant evidence.</dd></div>
            <div><dt>Moderate</dt><dd>The conclusion is useful, but context or important limitations can change its application.</dd></div>
            <div><dt>Low</dt><dd>The available evidence permits only a tentative conclusion.</dd></div>
          </dl>
        </div>
      </section>

      <section className="method-principles section-space">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="section-number light">02 / Editorial commitments</p><h2>What guides a page.</h2></div>
          </div>
          <div className="method-cards">
            <article>
              <Scale size={24} strokeWidth={1.3} />
              <span>01</span>
              <h3>Separate the layers</h3>
              <p>Facts, hypotheses, interpretations, opinions, and philosophical positions should not masquerade as one another.</p>
            </article>
            <article>
              <CircleHelp size={24} strokeWidth={1.3} />
              <span>02</span>
              <h3>Keep uncertainty</h3>
              <p>Individual variation, contested mechanisms, and the limits of generalization belong in the explanation.</p>
            </article>
            <article>
              <ShieldCheck size={24} strokeWidth={1.3} />
              <span>03</span>
              <h3>Teach for defense</h3>
              <p>Health knowledge is not diagnosis. Harmful influence is explained so people can recognize it, not reproduce it.</p>
            </article>
            <article>
              <GitPullRequest size={24} strokeWidth={1.3} />
              <span>04</span>
              <h3>Make revision normal</h3>
              <p>Knowledge changes. Content lives in version control so corrections can be reviewed, discussed, and traced.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="review-path section-space">
        <div className="shell review-grid">
          <div><p className="section-number">03 / Content path</p><h2>From a claim to a page.</h2></div>
          <ol>
            <li><span>01</span><div><strong>Frame the question</strong><p>Define what the concept explains—and what it does not.</p></div></li>
            <li><span>02</span><div><strong>Find the evidence</strong><p>Prefer primary research, systematic reviews, and accountable institutions.</p></div></li>
            <li><span>03</span><div><strong>Expose the limits</strong><p>Record counterarguments, variation, and unresolved questions.</p></div></li>
            <li><span>04</span><div><strong>Invite correction</strong><p>Publish sources and history so the community can improve the work.</p></div></li>
          </ol>
        </div>
        <div className="shell methodology-cta">
          <p>See the method in practice.</p>
          <Link href="/human-101">Begin Human 101 <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
