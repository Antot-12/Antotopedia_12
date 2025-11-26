"use client";

import Link from "next/link";
import { useMemo } from "react";

export type TagItem = { id: number; slug: string; name: string; count: number };
type Dict = any;

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

    if (tags.length === 0) {
        return <div className="card p-6 text-dim">{dict?.tags?.no_tags ?? "No tags"}</div>;
    }

    if (view === "cloud") {
        const counts = tags.map((t) => t.count);
        const minC = Math.min(...counts);
        const maxC = Math.max(...counts);
        const scale = (n: number) => {
            if (maxC === minC) return 1;
            const r = (n - minC) / (maxC - minC);
            return 0.9 + r * 1.0;
        };
        return (
            <section className="card p-5">
                <div className="flex flex-wrap gap-3 justify-center">
                    {tags.map((t) => (
                        <Link
                            key={t.id}
                            href={`/tags/${t.slug}`}
                            className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 text-accent px-4 py-2 hover:border-accent hover:bg-accent/15"
                            style={{ fontSize: `${scale(t.count)}rem` }}
                            title={`${t.name} • ${t.count}`}
                        >
                            #{highlight(t.name, q || "")}
                            <span className="ml-1 text-white/70 text-xs">{t.count}</span>
                        </Link>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <div className="grid gap-6">
            {letters.length > 0 && (
                <div className="card p-3 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {letters.map((l) => (
                            <a key={l} href={`#letter-${l}`} className="chip px-3 py-1">
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            {groups.map((g) => (
                <section key={g.letter} className="grid gap-3" id={`letter-${g.letter}`}>
                    <h2 className="text-xl font-semibold">{g.letter}</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-fr">
                        {g.items.map((t) => (
                            <Link
                                key={t.id}
                                href={`/tags/${t.slug}`}
                                className="card card-hover p-4 flex items-center justify-between h-full"
                                title={`${t.name} • ${t.count}`}
                            >
                                <span className="font-medium text-base">#{highlight(t.name, q || "")}</span>
                                <span className="text-dim text-sm">{t.count}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
