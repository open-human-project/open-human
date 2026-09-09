import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { EvidenceLevel } from "@/lib/types";

export function EvidenceBadge({
  level,
  locale,
  detailed = false,
}: {
  level: EvidenceLevel;
  locale: Locale;
  detailed?: boolean;
}) {
  const copy = getDictionary(locale).evidence;
  return (
    <span className={`evidence-badge level-${level.toLowerCase()}`}>
      <span aria-hidden="true">{level}</span>
      {detailed ? copy.labels[level] : `${copy.short} ${level}`}
    </span>
  );
}
