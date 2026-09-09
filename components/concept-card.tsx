import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { EvidenceBadge } from "@/components/evidence-badge";
import { getCategory } from "@/lib/categories";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Concept } from "@/lib/types";

type ConceptCardProps = {
  concept: Concept;
  locale: Locale;
  index?: number;
  variant?: "card" | "row";
};

export function ConceptCard({ concept, locale, index, variant = "card" }: ConceptCardProps) {
  const category = getCategory(locale, concept.category);
  const copy = getDictionary(locale).common;

  if (variant === "row") {
    return (
      <Link className="concept-row" href={localizedPath(locale, `/concepts/${concept.slug}`)}>
        <span className="concept-row-index">
          {String(index ?? concept.human_101_order ?? 0).padStart(2, "0")}
        </span>
        <span className="concept-row-main">
          <span className="concept-row-meta">{category?.name}</span>
          <strong>{concept.title}</strong>
          <span>{concept.description}</span>
        </span>
        <span className="concept-row-side">
          <EvidenceBadge level={concept.evidence_level} locale={locale} />
          <span className="reading-time">
            <Clock size={13} /> {concept.readingMinutes} {copy.minuteShort}
          </span>
        </span>
        <ArrowUpRight className="row-arrow" size={20} strokeWidth={1.4} />
      </Link>
    );
  }

  return (
    <Link className="concept-card" href={localizedPath(locale, `/concepts/${concept.slug}`)}>
      <div className="concept-card-top">
        <span>{category?.eyebrow}</span>
        <EvidenceBadge level={concept.evidence_level} locale={locale} />
      </div>
      <h3>{concept.title}</h3>
      <p>{concept.description}</p>
      <div className="concept-card-bottom">
        <span>{concept.readingMinutes} {copy.minuteRead}</span>
        <ArrowUpRight size={18} strokeWidth={1.4} />
      </div>
    </Link>
  );
}
