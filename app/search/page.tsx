import type { Metadata } from "next";
import { SearchInterface } from "@/components/search-interface";
import { getSearchDocuments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Open Human with a concept, pattern, or natural question.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <header className="search-hero">
        <div className="shell">
          <p className="eyebrow with-line">Search the library</p>
          <h1>Begin with what you <em>want to understand.</em></h1>
          <p>
            Use ordinary language. Search for an experience, a mechanism, or a
            question—not only an academic term.
          </p>
        </div>
      </header>
      <section className="search-page-section">
        <div className="shell">
          <SearchInterface documents={getSearchDocuments()} initialQuery="" />
        </div>
      </section>
    </>
  );
}
