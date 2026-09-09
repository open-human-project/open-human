"use client";

import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SearchForm({
  copy,
  locale,
  defaultValue,
  compact = false,
}: {
  copy: Dictionary["search"];
  locale: Locale;
  defaultValue?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState(defaultValue ?? "");
  const router = useRouter();
  const searchPath = localizedPath(locale, "/search");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    try {
      window.sessionStorage.setItem(`open-human:search-query:${locale}`, nextQuery);
    } catch {
      // The URL fragment remains the storage-free fallback below.
    }
    router.push(nextQuery ? `${searchPath}#${encodeURIComponent(nextQuery)}` : searchPath);
  }

  return (
    <form className={`question-search${compact ? " compact" : ""}`} onSubmit={submit}>
      <Search size={20} aria-hidden="true" strokeWidth={1.5} />
      <label className="sr-only" htmlFor={compact ? "compact-search" : "home-search"}>
        {copy.formLabel}
      </label>
      <input
        id={compact ? "compact-search" : "home-search"}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={copy.formPlaceholder}
        autoComplete="off"
      />
      <button type="submit" aria-label={copy.submit}>
        <ArrowRight size={20} strokeWidth={1.5} />
      </button>
    </form>
  );
}
