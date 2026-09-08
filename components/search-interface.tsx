"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { EvidenceBadge } from "@/components/evidence-badge";
import { categories, getCategory } from "@/lib/categories";
import { rankSearchDocuments } from "@/lib/search";
import type { CategorySlug, SearchDocument } from "@/lib/types";

export function SearchInterface({
  documents,
  initialQuery,
}: {
  documents: SearchDocument[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<"all" | CategorySlug>("all");
  const restoredSession = useRef(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let storedQuery: string | null = null;
    let storedCategory: string | null = null;
    try {
      storedQuery = window.sessionStorage.getItem("open-human:search-query");
      storedCategory = window.sessionStorage.getItem("open-human:search-category");
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
        window.history.replaceState(null, "", window.location.pathname);
      } else if (storedQuery) {
        setQuery(storedQuery);
      }

      if (categories.some((item) => item.slug === storedCategory)) {
        setCategory(storedCategory as CategorySlug);
      }
      restoredSession.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!restoredSession.current) return;
    try {
      window.sessionStorage.setItem("open-human:search-query", query);
      window.sessionStorage.setItem("open-human:search-category", category);
    } catch {
      // Storage is an enhancement, not a requirement for local search.
    }
  }, [query, category]);

  const results = useMemo(() => {
    return rankSearchDocuments(documents, deferredQuery, category);
  }, [documents, deferredQuery, category]);

  return (
    <div className="search-interface">
      <div className="search-page-field">
        <Search size={21} strokeWidth={1.5} aria-hidden="true" />
        <label className="sr-only" htmlFor="library-search">
          Search the library
        </label>
        <input
          id="library-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “Why do people follow groups?”"
          autoFocus={Boolean(initialQuery)}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
            <X size={18} />
          </button>
        )}
      </div>
      <p className="search-privacy-note">
        Search runs locally and is kept only for this browser tab. Your question is not sent to an external search service.
      </p>

      <div className="search-tools">
        <div className="search-filter-label">
          <SlidersHorizontal size={14} /> Filter by field
        </div>
        <div className="filter-pills" role="group" aria-label="Filter search by field">
          <button
            type="button"
            className={category === "all" ? "active" : ""}
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            All
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
              {results.length} {results.length === 1 ? "concept" : "concepts"} for <strong>“{query}”</strong>
            </>
          ) : (
            <>Browse all {results.length} concepts</>
          )}
        </p>
      </div>

      {results.length ? (
        <div className="search-results">
          {results.map(({ document }, index) => {
            const itemCategory = getCategory(document.category);
            return (
              <Link href={`/concepts/${document.slug}`} key={document.slug}>
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
                  <EvidenceBadge level={document.evidence_level} />
                  <span>{document.readingMinutes} min read</span>
                </span>
                <ArrowUpRight size={19} strokeWidth={1.4} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="search-zero">
          <p className="eyebrow">No exact path found</p>
          <h2>Try a broader idea.</h2>
          <p>
            Search for a single concept like “memory,” “status,” “sleep,” or
            “manipulation.” The library is still growing.
          </p>
          <button type="button" onClick={() => setQuery("")}>Browse every concept</button>
        </div>
      )}
    </div>
  );
}
