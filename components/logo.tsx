import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export function Logo({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const homeLabel = locale === "id" ? "Beranda Open Human" : "Open Human home";
  return (
    <Link className="brand" href={localizedPath(locale)} aria-label={homeLabel}>
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
