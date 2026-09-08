"use client";

import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchForm({
  defaultValue,
  compact = false,
}: {
  defaultValue?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState(defaultValue ?? "");
  const router = useRouter();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    try {
      window.sessionStorage.setItem("open-human:search-query", nextQuery);
      router.push("/search");
    } catch {
      router.push(nextQuery ? `/search#${encodeURIComponent(nextQuery)}` : "/search");
    }
  }

  return (
    <form className={`question-search${compact ? " compact" : ""}`} onSubmit={submit}>
      <Search size={20} aria-hidden="true" strokeWidth={1.5} />
      <label className="sr-only" htmlFor={compact ? "compact-search" : "home-search"}>
        Search Open Human
      </label>
      <input
        id={compact ? "compact-search" : "home-search"}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ask a question about being human…"
        autoComplete="off"
      />
      <button type="submit" aria-label="Search">
        <ArrowRight size={20} strokeWidth={1.5} />
      </button>
    </form>
  );
}
