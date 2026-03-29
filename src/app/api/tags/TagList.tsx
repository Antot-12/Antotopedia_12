"use client";

import Link from "next/link";
import { useMemo } from "react";

export type TagItem = { id: number; slug: string; name: string; count: number };
type Dict = any;

// Assign colors based on tag name hash
function getTagColor(name: string) {
    const colors = [
        { bg: "bg-blue-500/10", border: "border-blue-500/40", text: "text-blue-400", icon: "💙" },
        { bg: "bg-green-500/10", border: "border-green-500/40", text: "text-green-400", icon: "💚" },
        { bg: "bg-purple-500/10", border: "border-purple-500/40", text: "text-purple-400", icon: "💜" },
        { bg: "bg-pink-500/10", border: "border-pink-500/40", text: "text-pink-400", icon: "💗" },
        { bg: "bg-orange-500/10", border: "border-orange-500/40", text: "text-orange-400", icon: "🧡" },
        { bg: "bg-cyan-500/10", border: "border-cyan-500/40", text: "text-cyan-400", icon: "🩵" },
        { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-400", icon: "💛" },
        { bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-400", icon: "❤️" },
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// Check if tag is trending (top 10% by count)
function isTrending(tag: TagItem, allTags: TagItem[]) {
    const sorted = [...allTags].sort((a, b) => b.count - a.count);
    const topCount = Math.ceil(sorted.length * 0.1);
    return sorted.slice(0, topCount).some(t => t.id === tag.id);
}

// Calculate growth indicator (mock - in real app would compare to historical data)
function getGrowthIndicator(count: number) {
    if (count > 50) return { icon: "📈", text: "+12%", color: "text-green-400" };
    if (count > 20) return { icon: "📊", text: "+5%", color: "text-blue-400" };
    if (count > 10) return { icon: "→", text: "stable", color: "text-white/50" };
    return { icon: "📉", text: "new", color: "text-yellow-400" };
}

function groupByInitial(tags: TagItem[]) {
    const map = new Map<string, TagItem[]>();
    for (const t of tags) {
        const k = t.name.slice(0, 1).toUpperCase();
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(t);
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, items]) => ({
            letter,
            items: items.sort((x, y) => x.name.localeCompare(y.name)),
        }));
}

function highlight(text: string, q: string) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const mid = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
        <>
            {before}
            <mark className="bg-accent/20 text-accent">{mid}</mark>
            {after}
        </>
    );
}

export default function TagList({
                                    tags,
                                    q,
                                    view,
                                    min,
                                    dict,
                                }: {
    tags: TagItem[];
    q?: string;
    view: "list" | "cloud";
    min: number;
    dict: Dict;
}) {
    const groups = useMemo(() => (view === "list" ? groupByInitial(tags) : []), [tags, view]);
    const letters = useMemo(() => groups.map((g) => g.letter), [groups]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (tags.length === 0) return null;
        const total = tags.reduce((sum, t) => sum + t.count, 0);
        const avg = Math.round(total / tags.length);
        const max = Math.max(...tags.map(t => t.count));
        const trending = tags.filter(t => isTrending(t, tags));
        return { total, avg, max, trendingCount: trending.length };
    }, [tags]);

    if (tags.length === 0) {
        return (
            <div className="card p-8 text-center">
                <div className="text-4xl mb-3">🏷️</div>
                <div className="text-lg text-white/80 mb-2">{dict?.tags?.no_tags ?? "No tags found"}</div>
                <div className="text-sm text-white/50">Try adjusting your filters</div>
            </div>
        );
    }

    if (view === "cloud") {
        const counts = tags.map((t) => t.count);
        const minC = Math.min(...counts);
        const maxC = Math.max(...counts);
        const scale = (n: number) => {
            if (maxC === minC) return 1;
            const r = (n - minC) / (maxC - minC);
            return 0.9 + r * 1.2;
        };
        return (
            <div className="space-y-4">
                {/* Statistics Bar */}
                {stats && (
                    <div className="card p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-accent">{tags.length}</div>
                                <div className="text-xs text-white/60">Tags</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                                <div className="text-xs text-white/60">Total Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">{stats.avg}</div>
                                <div className="text-xs text-white/60">Avg Posts/Tag</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">{stats.trendingCount}</div>
                                <div className="text-xs text-white/60">🔥 Trending</div>
                            </div>
                        </div>
                    </div>
                )}

                <section className="card p-4 sm:p-5">
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                        {tags.map((t) => {
                            const color = getTagColor(t.name);
                            const trending = isTrending(t, tags);
                            return (
                                <Link
                                    key={t.id}
                                    href={`/tags/${t.slug}`}
                                    className={`inline-flex items-center gap-1 rounded-full border ${color.border} ${color.bg} ${color.text} px-3 sm:px-4 py-2 hover:scale-105 min-h-[44px] touch-manipulation transition group relative`}
                                    style={{ fontSize: `${scale(t.count)}rem` }}
                                    title={`${t.name} • ${t.count} posts${trending ? ' • Trending' : ''}`}
                                >
                                    {trending && <span className="text-sm">🔥</span>}
                                    <span className="text-sm">{color.icon}</span>
                                    #{highlight(t.name, q || "")}
                                    <span className="ml-1 text-white/70 text-xs font-semibold bg-black/20 px-1.5 py-0.5 rounded">
                                        {t.count}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:gap-6">
            {/* Statistics Bar */}
            {stats && (
                <div className="card p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent">{tags.length}</div>
                            <div className="text-xs text-white/60">Tags</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                            <div className="text-xs text-white/60">Total Posts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{stats.avg}</div>
                            <div className="text-xs text-white/60">Avg Posts/Tag</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{stats.trendingCount}</div>
                            <div className="text-xs text-white/60">🔥 Trending</div>
                        </div>
                    </div>
                </div>
            )}

            {letters.length > 0 && (
                <div className="card p-3 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {letters.map((l) => (
                            <a key={l} href={`#letter-${l}`} className="chip px-3 py-2 min-h-[44px] touch-manipulation flex items-center hover:bg-accent/20 transition">
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            {groups.map((g) => (
                <section key={g.letter} className="grid gap-3" id={`letter-${g.letter}`}>
                    <h2 className="text-lg sm:text-xl font-semibold">{g.letter}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-fr">
                        {g.items.map((t) => {
                            const color = getTagColor(t.name);
                            const trending = isTrending(t, tags);
                            const growth = getGrowthIndicator(t.count);
                            return (
                                <Link
                                    key={t.id}
                                    href={`/tags/${t.slug}`}
                                    className={`card card-hover p-4 h-full min-h-[80px] touch-manipulation border ${color.border} ${color.bg} group relative overflow-hidden`}
                                    title={`${t.name} • ${t.count} posts${trending ? ' • Trending' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{color.icon}</span>
                                            <span className={`font-medium text-sm sm:text-base ${color.text}`}>
                                                #{highlight(t.name, q || "")}
                                            </span>
                                        </div>
                                        {trending && <span className="text-lg">🔥</span>}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1">
                                            <span className="text-white/70">{t.count} posts</span>
                                            <span className={`${growth.color} ml-1`}>{growth.icon} {growth.text}</span>
                                        </div>
                                    </div>

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}
