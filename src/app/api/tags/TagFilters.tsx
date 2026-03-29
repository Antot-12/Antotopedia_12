"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Dict = any;

export default function TagFilters({
                                       q,
                                       sort,
                                       view,
                                       min,
                                       dict,
                                   }: {
    q: string;
    sort: "popular" | "alpha" | "recent";
    view: "list" | "cloud";
    min: string;
    dict: Dict;
}) {
    const [val, setVal] = useState(q);
    const [minPosts, setMinPosts] = useState(Number(min) || 0);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [excludeQuery, setExcludeQuery] = useState("");

    const tSearch = dict?.tags?.search ?? "Search tags...";
    const tSearchBtn = dict?.common?.search ?? "Search";
    const tPopular = dict?.tags?.popular ?? "Popular";
    const tAlpha = dict?.tags?.alpha ?? "A–Z";
    const tRecent = dict?.tags?.recent ?? "Recent";
    const tList = dict?.tags?.list ?? "List";
    const tCloud = dict?.tags?.cloud ?? "Cloud";
    const tMinPosts = dict?.tags?.total_posts ?? "Min posts";

    const qs = useMemo(
        () =>
            (params: Partial<{ q: string; sort: string; view: string; min: string }>) => {
                const sp = new URLSearchParams({
                    q: params.q ?? val,
                    sort: params.sort ?? sort,
                    view: params.view ?? view,
                    min: params.min ?? String(minPosts),
                });
                return sp.toString();
            },
        [val, sort, view, minPosts]
    );

    // Suggested tags based on common categories
    const suggestedTags = [
        { name: "tutorial", icon: "📚", color: "blue" },
        { name: "javascript", icon: "⚡", color: "yellow" },
        { name: "react", icon: "⚛️", color: "cyan" },
        { name: "nextjs", icon: "▲", color: "white" },
        { name: "typescript", icon: "🔷", color: "blue" },
        { name: "css", icon: "🎨", color: "pink" },
        { name: "api", icon: "🔌", color: "green" },
        { name: "database", icon: "💾", color: "purple" },
    ];

    return (
        <div className="card p-3 sm:p-4 grid gap-3">
            {/* Search Form */}
            <form action="/tags" className="grid gap-2">
                <div className="flex gap-2">
                    <input
                        name="q"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        placeholder={tSearch}
                        className="input flex-1 min-h-[44px] touch-manipulation"
                    />
                    <button type="submit" className="btn btn-primary min-h-[44px] touch-manipulation px-4 sm:px-6">
                        🔍
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`btn ${showAdvanced ? 'btn-accent' : 'btn-soft'} min-h-[44px] touch-manipulation px-4`}
                        title="Advanced filters"
                    >
                        ⚙️
                    </button>
                </div>

                {/* Quick Suggestions */}
                {!val && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-white/50">Quick:</span>
                        {suggestedTags.slice(0, 4).map((tag) => (
                            <button
                                key={tag.name}
                                type="button"
                                onClick={() => setVal(tag.name)}
                                className="text-xs px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent transition min-h-[32px]"
                            >
                                {tag.icon} {tag.name}
                            </button>
                        ))}
                    </div>
                )}
            </form>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="border-t border-white/10 pt-3 space-y-3">
                    <div className="text-sm text-white/70 font-semibold">🔍 Advanced Filters</div>

                    {/* Exclude tags */}
                    <div>
                        <label className="text-xs text-white/60 block mb-1">Exclude tags (comma-separated):</label>
                        <input
                            type="text"
                            value={excludeQuery}
                            onChange={(e) => setExcludeQuery(e.target.value)}
                            placeholder="e.g., old, deprecated, test"
                            className="input w-full min-h-[40px] text-sm"
                        />
                    </div>

                    {/* All suggested categories */}
                    <div>
                        <label className="text-xs text-white/60 block mb-2">Popular categories:</label>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map((tag) => (
                                <button
                                    key={tag.name}
                                    type="button"
                                    onClick={() => setVal(tag.name)}
                                    className="text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent transition min-h-[36px]"
                                >
                                    {tag.icon} {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Sort & View Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-white/50 hidden sm:inline">Sort:</span>
                <Link
                    href={`/tags?${qs({ sort: "popular" })}`}
                    className={`btn ${sort === "popular" ? "btn-primary" : "btn-soft"} min-h-[44px] touch-manipulation text-sm sm:text-base`}
                >
                    🔥 {tPopular}
                </Link>
                <Link
                    href={`/tags?${qs({ sort: "alpha" })}`}
                    className={`btn ${sort === "alpha" ? "btn-primary" : "btn-soft"} min-h-[44px] touch-manipulation text-sm sm:text-base`}
                >
                    🔤 {tAlpha}
                </Link>
                <Link
                    href={`/tags?${qs({ sort: "recent" })}`}
                    className={`btn ${sort === "recent" ? "btn-primary" : "btn-soft"} min-h-[44px] touch-manipulation text-sm sm:text-base`}
                >
                    🆕 {tRecent}
                </Link>

                <span className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

                <span className="text-xs text-white/50 hidden sm:inline">View:</span>
                <Link
                    href={`/tags?${qs({ view: "list" })}`}
                    className={`btn ${view === "list" ? "btn-primary" : "btn-soft"} min-h-[44px] touch-manipulation text-sm sm:text-base`}
                >
                    📋 {tList}
                </Link>
                <Link
                    href={`/tags?${qs({ view: "cloud" })}`}
                    className={`btn ${view === "cloud" ? "btn-primary" : "btn-soft"} min-h-[44px] touch-manipulation text-sm sm:text-base`}
                >
                    ☁️ {tCloud}
                </Link>
            </div>

            {/* Min Posts Filter */}
            <form action="/tags" className="grid gap-2 border-t border-white/10 pt-3">
                <input type="hidden" name="q" value={val} />
                <input type="hidden" name="sort" value={sort} />
                <input type="hidden" name="view" value={view} />
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-white/70">{tMinPosts}:</div>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-soft min-h-[44px] px-4 touch-manipulation font-semibold">
                            {minPosts}+ posts
                        </button>
                        {minPosts > 0 && (
                            <button
                                type="button"
                                onClick={() => setMinPosts(0)}
                                className="text-xs text-accent hover:underline"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
                <input
                    name="min"
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={minPosts}
                    onChange={(e) => setMinPosts(Number(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-white/40">
                    <span>0</span>
                    <span>25</span>
                    <span>50+</span>
                </div>
            </form>
        </div>
    );
}
