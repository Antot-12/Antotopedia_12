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
  _count?: { posts: number };
};

type Labels = {
  placeholder?: string;
  filters?: string;
  advancedFilters?: string;
  clearFilters?: string;
  filterByTags?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  relevance?: string;
  dateDesc?: string;
  dateAsc?: string;
  titleAsc?: string;
  didYouMean?: string;
  noResultsTitle?: string;
  noResultsText?: string;
};

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY = 10;

export default function AdvancedSearch({ labels }: { labels?: Labels }) {
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
  const [availableTags, setAvailableTags] = useState<Array<{ name: string; slug: string; _count?: { posts: number } }>>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch {}
    }
  }, []);

  // Load available tags with post counts
  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setAvailableTags(data || []))
      .catch(() => setAvailableTags([]));
  }, []);

  // Search with debounce and fuzzy matching
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

      // Apply client-side fuzzy search if no exact results
      let searchResults = data.results || [];
      if (searchResults.length === 0 && filters.query) {
        searchResults = fuzzySearch(data.allPosts || [], filters.query);
      }

      setResults(searchResults);
      setSuggestions(data.suggestions || []);

      // Save to history if we have results
      if (filters.query && searchResults.length > 0) {
        saveToHistory(filters.query);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fuzzy search implementation
  const fuzzySearch = (items: any[], query: string) => {
    const q = query.toLowerCase();
    return items
      .map((item) => {
        const title = (item.title || "").toLowerCase();
        const description = (item.description || "").toLowerCase();

        // Calculate fuzzy score
        let score = 0;
        if (title.includes(q)) score += 10;
        if (description.includes(q)) score += 5;

        // Character proximity scoring
        for (let i = 0; i < q.length - 1; i++) {
          const char = q[i];
          const nextChar = q[i + 1];
          const titleIdx = title.indexOf(char);
          const titleNextIdx = title.indexOf(nextChar, titleIdx);

          if (titleIdx !== -1 && titleNextIdx !== -1 && titleNextIdx - titleIdx < 3) {
            score += 2;
          }
        }

        return { ...item, _fuzzyScore: score };
      })
      .filter((item) => item._fuzzyScore > 0)
      .sort((a, b) => b._fuzzyScore - a._fuzzyScore)
      .slice(0, 10);
  };

  const saveToHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    const updated = [trimmed, ...searchHistory.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY);
    setSearchHistory(updated);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
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
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              placeholder={labels?.placeholder || "🔍 Search posts, tags, content..."}
              className="input pr-10"
              autoFocus
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Search History Dropdown */}
            {showHistory && searchHistory.length > 0 && !filters.query && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="p-2 border-b border-border flex items-center justify-between">
                  <span className="text-xs text-white/60">Recent searches</span>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-400 hover:text-red-300 transition"
                  >
                    Clear
                  </button>
                </div>
                {searchHistory.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFilters((f) => ({ ...f, query }));
                      setShowHistory(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {query}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? "btn-primary" : "btn-soft"} whitespace-nowrap`}
          >
            {labels?.filters || "🎛️ Filters"}
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-white/60">{labels?.didYouMean || "Did you mean:"}</span>
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
            <h3 className="font-semibold">{labels?.advancedFilters || "Advanced Filters"}</h3>
            <button onClick={clearFilters} className="text-xs text-accent hover:underline">
              {labels?.clearFilters || "Clear all"}
            </button>
          </div>

          {/* Tags Filter with Post Counts */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">{labels?.filterByTags || "Filter by tags:"}</label>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(availableTags) && availableTags.slice(0, 20).map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => toggleTag(tag.slug)}
                  className={`text-sm px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                    filters.tags.includes(tag.slug)
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-white/5 border-white/10 hover:border-accent/50"
                  }`}
                >
                  #{tag.name}
                  {tag._count?.posts && (
                    <span className="text-xs opacity-70">({tag._count.posts})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-1 block">{labels?.fromDate || "From date:"}</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                className="input w-full"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 mb-1 block">{labels?.toDate || "To date:"}</label>
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
            <label className="text-sm text-white/70 mb-2 block">{labels?.sortBy || "Sort by:"}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters((f) => ({ ...f, sortBy: "relevance" }))}
                className={`btn ${filters.sortBy === "relevance" ? "btn-primary" : "btn-soft"}`}
              >
                {labels?.relevance || "Relevance"}
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, sortBy: "date" }))}
                className={`btn ${filters.sortBy === "date" ? "btn-primary" : "btn-soft"}`}
              >
                {labels?.dateDesc || "Date"}
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, sortBy: "title" }))}
                className={`btn ${filters.sortBy === "title" ? "btn-primary" : "btn-soft"}`}
              >
                {labels?.titleAsc || "Title"}
              </button>
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
                  {Array.isArray(result.tags) && result.tags.length > 0 && (
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
            <div className="text-lg mb-2">{labels?.noResultsTitle || "No results found"}</div>
            <div className="text-sm">{labels?.noResultsText || "Try different keywords or adjust your filters"}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
