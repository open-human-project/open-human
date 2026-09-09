"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { EvidenceBadge } from "@/components/evidence-badge";
import type { Category } from "@/lib/categories";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { rankSearchDocuments } from "@/lib/search";
import type { CategorySlug, SearchDocument } from "@/lib/types";

export function SearchInterface({
  categories,
  copy,
  documents,
  initialQuery,
  locale,
}: {
  categories: Category[];
  copy: Dictionary["search"];
  documents: SearchDocument[];
  initialQuery: string;
  locale: Locale;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<"all" | CategorySlug>("all");
  const restoredSession = useRef(false);
  const deferredQuery = useDeferredValue(query);
  const queryKey = `open-human:search-query:${locale}`;
  const categoryKey = `open-human:search-category:${locale}`;

  useEffect(() => {
    let storedQuery: string | null = null;
    let storedCategory: string | null = null;
    try {
      storedQuery = window.sessionStorage.getItem(queryKey);
      storedCategory = window.sessionStorage.getItem(categoryKey);
    } catch {
      // Search still works when browser storage is unavailable.
    }
    let hashQuery = "";
    try {
      hashQuery = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
    } catch {
      hashQuery = window.location.hash.slice(1);
    }

    const frame = window.requestAnimationFrame(() => {
      if (hashQuery) {
        setQuery(hashQuery);
      } else if (storedQuery) {
        setQuery(storedQuery);
      }

      if (categories.some((item) => item.slug === storedCategory)) {
        setCategory(storedCategory as CategorySlug);
      }
      restoredSession.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [categories, categoryKey, queryKey]);

  useEffect(() => {
    if (!restoredSession.current) return;
    try {
      window.sessionStorage.setItem(queryKey, query);
      window.sessionStorage.setItem(categoryKey, category);
    } catch {
      // Storage is an enhancement, not a requirement for local search.
    }

    const nextHash = query.trim() ? `#${encodeURIComponent(query.trim())}` : "";
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, "", nextUrl);
      window.dispatchEvent(new Event("open-human:url-change"));
    }
  }, [category, categoryKey, query, queryKey]);

  const results = useMemo(() => {
    return rankSearchDocuments(documents, deferredQuery, locale, category);
  }, [category, deferredQuery, documents, locale]);

  return (
    <div className="search-interface">
      <div className="search-page-field">
        <Search size={21} strokeWidth={1.5} aria-hidden="true" />
        <label className="sr-only" htmlFor="library-search">
          {copy.inputLabel}
        </label>
        <input
          id="library-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.placeholder}
          autoFocus={Boolean(initialQuery)}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label={copy.clear}>
            <X size={18} />
          </button>
        )}
      </div>
      <p className="search-privacy-note">{copy.privacy}</p>

      <div className="search-tools">
        <div className="search-filter-label">
          <SlidersHorizontal size={14} /> {copy.filter}
        </div>
        <div className="filter-pills" role="group" aria-label={copy.filterAria}>
          <button
            type="button"
            className={category === "all" ? "active" : ""}
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            {copy.all}
          </button>
          {categories.map((item) => (
            <button
              type="button"
              className={category === item.slug ? "active" : ""}
              aria-pressed={category === item.slug}
              onClick={() => setCategory(item.slug)}
              key={item.slug}
            >
              {item.shortName}
            </button>
          ))}
        </div>
      </div>

      <div className="search-summary" aria-live="polite">
        <p>
          {query.trim() ? (
            <>
              {results.length}{" "}
              {results.length === 1 ? copy.resultSingular : copy.resultPlural}{" "}
              {copy.resultFor} <strong>“{query}”</strong>
            </>
          ) : (
            <>{copy.browseAll} {results.length} {copy.resultPlural}</>
          )}
        </p>
      </div>

      {results.length ? (
        <div className="search-results">
          {results.map(({ document }, index) => {
            const itemCategory = categories.find((item) => item.slug === document.category);
            return (
              <Link
                href={localizedPath(locale, `/concepts/${document.slug}`)}
                key={document.slug}
              >
                <span className="search-result-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="search-result-main">
                  <span className="search-result-category">{itemCategory?.name}</span>
                  <strong>{document.title}</strong>
                  <span>{document.description}</span>
                  <span className="search-result-tags">
                    {document.tags.slice(0, 3).map((tag) => (
                      <i key={tag}>{tag}</i>
                    ))}
                  </span>
                </span>
                <span className="search-result-side">
                  <EvidenceBadge level={document.evidence_level} locale={locale} />
                  <span>{document.readingMinutes} {copy.minRead}</span>
                </span>
                <ArrowUpRight size={19} strokeWidth={1.4} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="search-zero">
          <p className="eyebrow">{copy.noResultEyebrow}</p>
          <h2>{copy.noResultTitle}</h2>
          <p>{copy.noResultDescription}</p>
          <button type="button" onClick={() => setQuery("")}>{copy.browseEvery}</button>
        </div>
      )}
    </div>
  );
}
