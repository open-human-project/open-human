import type { Metadata } from "next";
import { SearchInterface } from "@/components/search-interface";
import { getCategories } from "@/lib/categories";
import { getSearchDocuments } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).search;
  return createLocalizedMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: "/search",
    robots: { index: false, follow: true },
  });
}

export default async function SearchPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getDictionary(locale).search;
  return (
    <>
      <header className="search-hero">
        <div className="shell">
          <p className="eyebrow with-line">{copy.eyebrow}</p>
          <h1>{copy.headingStart} <em>{copy.headingEmphasis}</em></h1>
          <p>{copy.introduction}</p>
        </div>
      </header>
      <section className="search-page-section">
        <div className="shell">
          <SearchInterface
            categories={getCategories(locale)}
            copy={copy}
            documents={getSearchDocuments(locale)}
            initialQuery=""
            locale={locale}
          />
        </div>
      </section>
    </>
  );
}
