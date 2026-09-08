import type { CategorySlug } from "@/lib/types";

export function CategoryGlyph({ category }: { category: CategorySlug }) {
  if (category === "body") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r="32" />
        <path d="M48 16c-11 9-17 20-17 32s6 23 17 32c11-9 17-20 17-32S59 25 48 16Z" />
        <path d="M31 48h34M48 16v64" />
      </svg>
    );
  }

  if (category === "mind") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r="32" />
        <circle cx="48" cy="48" r="19" />
        <circle cx="48" cy="48" r="5" className="glyph-fill" />
        <path d="M48 16v13M48 67v13M16 48h13M67 48h13" />
      </svg>
    );
  }

  if (category === "self-awareness") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M11 48s14-24 37-24 37 24 37 24-14 24-37 24S11 48 11 48Z" />
        <circle cx="48" cy="48" r="13" />
        <circle cx="48" cy="48" r="4" className="glyph-fill" />
      </svg>
    );
  }

  if (category === "human-nature") {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="35" cy="40" r="18" />
        <circle cx="61" cy="40" r="18" />
        <circle cx="48" cy="61" r="18" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <path d="M48 13 81 32v32L48 83 15 64V32L48 13Z" />
      <path d="m15 32 33 19 33-19M48 51v32" />
      <circle cx="48" cy="38" r="6" className="glyph-fill" />
    </svg>
  );
}
