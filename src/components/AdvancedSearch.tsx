"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SearchFilters = {
  query: string;
  tags: string[];
  dateFrom: string;
  dateTo: string;
  sortBy: "relevance" | "date" | "title";
};

type SearchResult = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  createdAt: string;
  tags: { name: string; slug: string }[];
  excerpt?: string;
};

export default function AdvancedSearch() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    tags: [],
    dateFrom: "",
    dateTo: "",
    sortBy: "relevance",
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [availableTags, setAvailableTags] = useState<{ name: string; slug: string }[]>([]);

  // Load available tags
  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setAvailableTags(data || []))
      .catch(() => setAvailableTags([]));
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.query.length > 0) {
        performSearch();
      } else {
        setResults([]);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append("q", filters.query);
      if (filters.tags.length > 0) params.append("tags", filters.tags.join(","));
      if (filters.dateFrom) params.append("from", filters.dateFrom);
      if (filters.dateTo) params.append("to", filters.dateTo);
      params.append("sort", filters.sortBy);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      tags: [],
      dateFrom: "",
      dateTo: "",
      sortBy: "relevance",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="card p-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
              placeholder="🔍 Search posts, tags, content..."
              className="input pr-10"
              autoFocus
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? "btn-primary" : "btn-soft"} whitespace-nowrap`}
          >
            🎛️ Filters
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-white/60">Did you mean:</span>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setFilters((f) => ({ ...f, query: suggestion }))}
                className="text-xs px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Advanced Filters</h3>
            <button onClick={clearFilters} className="text-xs text-accent hover:underline">
              Clear all
            </button>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Filter by tags:</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 20).map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => toggleTag(tag.slug)}
                  className={`text-sm px-3 py-1 rounded-full border transition ${
                    filters.tags.includes(tag.slug)
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-white/5 border-white/10 hover:border-accent/50"
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-1 block">From date:</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                className="input w-full"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 mb-1 block">To date:</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                className="input w-full"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Sort by:</label>
            <div className="flex gap-2">
              {(["relevance", "date", "title"] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setFilters((f) => ({ ...f, sortBy: sort }))}
                  className={`btn ${filters.sortBy === sort ? "btn-primary" : "btn-soft"} capitalize`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {loading ? (
          <div className="card p-8 text-center text-white/60">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Searching...
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="text-sm text-white/70">
              Found {results.length} result{results.length !== 1 ? "s" : ""}
            </div>
            {results.map((result) => (
              <Link key={result.id} href={`/blog/${result.slug}`} className="card card-hover p-4 block">
                <h3 className="text-lg font-semibold mb-1 hover:text-accent transition">
                  {result.title}
                </h3>
                {result.excerpt && (
                  <p className="text-sm text-white/70 line-clamp-2 mb-2">{result.excerpt}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                  <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                  {result.tags.length > 0 && (
                    <>
                      <span>•</span>
                      {result.tags.slice(0, 3).map((tag) => (
                        <span key={tag.slug} className="text-accent">
                          #{tag.name}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </Link>
            ))}
          </>
        ) : filters.query ? (
          <div className="card p-8 text-center text-white/60">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-lg mb-2">No results found</div>
            <div className="text-sm">Try different keywords or adjust your filters</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
