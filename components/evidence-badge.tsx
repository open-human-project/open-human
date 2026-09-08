import type { EvidenceLevel } from "@/lib/types";

const labels: Record<EvidenceLevel, string> = {
  A: "Strong evidence",
  B: "Good evidence",
  C: "Emerging / mixed",
  D: "Hypothesis",
  E: "Interpretive",
};

export function EvidenceBadge({ level, detailed = false }: { level: EvidenceLevel; detailed?: boolean }) {
  return (
    <span className={`evidence-badge level-${level.toLowerCase()}`}>
      <span aria-hidden="true">{level}</span>
      {detailed ? labels[level] : `Evidence ${level}`}
    </span>
  );
}

export const evidenceLabels = labels;
