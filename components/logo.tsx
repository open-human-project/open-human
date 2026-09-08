import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="Open Human home">
      <svg
        className="brand-mark"
        viewBox="0 0 40 40"
        role="img"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="17.5" fill="none" stroke="currentColor" />
        <path d="M13 20h14M20 13v14" stroke="currentColor" />
        <circle cx="20" cy="20" r="3.25" fill="currentColor" />
      </svg>
      {!compact && <span>Open Human</span>}
    </Link>
  );
}
