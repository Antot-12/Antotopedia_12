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

    return (
        <div className="card p-4 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
            <form action="/tags" className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                    name="q"
                    defaultValue={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={tSearch}
                    className="input"
                />
                <button className="btn btn-primary">{tSearchBtn}</button>
            </form>

            <div className="flex gap-2">
                <Link
                    href={`/tags?${qs({ sort: "popular" })}`}
                    className={`btn ${sort === "popular" ? "btn-primary" : "btn-soft"}`}
                >
                    {tPopular}
                </Link>
                <Link
                    href={`/tags?${qs({ sort: "alpha" })}`}
                    className={`btn ${sort === "alpha" ? "btn-primary" : "btn-soft"}`}
                >
                    {tAlpha}
                </Link>
                <Link
                    href={`/tags?${qs({ sort: "recent" })}`}
                    className={`btn ${sort === "recent" ? "btn-primary" : "btn-soft"}`}
                >
                    {tRecent}
                </Link>
            </div>

            <div className="flex gap-2">
                <Link
                    href={`/tags?${qs({ view: "list" })}`}
                    className={`btn ${view === "list" ? "btn-primary" : "btn-soft"}`}
                >
                    {tList}
                </Link>
                <Link
                    href={`/tags?${qs({ view: "cloud" })}`}
                    className={`btn ${view === "cloud" ? "btn-primary" : "btn-soft"}`}
                >
                    {tCloud}
                </Link>
            </div>

            <form action="/tags" className="grid gap-2 sm:grid-cols-[auto_1fr_auto] items-center">
                <input type="hidden" name="q" value={val} />
                <input type="hidden" name="sort" value={sort} />
                <input type="hidden" name="view" value={view} />
                <div className="text-sm text-dim">{tMinPosts}</div>
                <input
                    name="min"
                    type="range"
                    min={0}
                    max={50}
                    value={minPosts}
                    onChange={(e) => setMinPosts(Number(e.target.value))}
                    className="w-40"
                />
                <button className="btn btn-soft">{minPosts}</button>
            </form>
        </div>
    );
}
