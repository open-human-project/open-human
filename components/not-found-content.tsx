import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function NotFoundContent({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).notFound;

  return (
    <section className="not-found-page">
      <div className="shell">
        <p className="eyebrow with-line">{copy.eyebrow}</p>
        <h1>
          {copy.title} <em>{copy.emphasis}</em>
        </h1>
        <p>{copy.description}</p>
        <div>
          <Link
            className="button button-primary"
            href={localizedPath(locale, "/search")}
          >
            <Search size={16} /> {copy.search}
          </Link>
          <Link className="text-link" href={localizedPath(locale)}>
            <ArrowLeft size={15} /> {copy.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
