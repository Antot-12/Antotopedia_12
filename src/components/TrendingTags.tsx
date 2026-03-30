"use client";

import useSWR from "swr";
import Link from "next/link";
import { useEffect } from "react";

type Tag = { id?: number; name: string; slug?: string; _count?: { posts: number } };
type Api = { tags?: Tag[] };

const fetcher = (url: string) =>
    fetch(url, { cache: "no-store" }).then((r) => r.json() as Promise<Api | Tag[]>);

export default function TrendingTags({
    initial,
    title,
    noTagsText
}: {
    initial?: Tag[];
    title?: string;
    noTagsText?: string;
}) {
  const { data, isLoading, mutate } = useSWR("/api/tags", fetcher, {
    fallbackData: initial,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnMount: !initial,
    dedupingInterval: 60_000,
    keepPreviousData: true,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    const onChanged = () => mutate();
    window.addEventListener("tags:changed", onChanged);
    return () => window.removeEventListener("tags:changed", onChanged);
  }, [mutate]);

  const listRaw = Array.isArray(data) ? data : data?.tags ?? [];
  const map = new Map<string, Tag>();
  (listRaw || []).forEach((t) => {
    const k = (t.slug || t.name).toLowerCase();
    if (!map.has(k)) map.set(k, t);
  });

  const tags = Array.from(map.values())
      .filter((t) => (t._count?.posts ?? 0) > 0)
      .sort((a, b) => (b._count?.posts ?? 0) - (a._count?.posts ?? 0))
      .slice(0, 6);

  return (
      <div className="card p-4 max-w-[360px]">
        <h3 className="text-sm font-semibold mb-3">{title ?? "Trending tags"}</h3>
        {isLoading && (!tags || tags.length === 0) ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="chip animate-pulse px-3 py-1 text-sm">
              ...
            </span>
              ))}
            </div>
        ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map((t) => (
                  <Link
                      key={t.slug ?? t.id ?? t.name}
                      href={`/tags/${t.slug ?? t.name}`}
                      className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 text-accent text-base px-4 py-1.5 hover:border-accent hover:bg-accent/15"
                  >
                    #{t.name}
                    <span className="ml-1 text-white/70 text-xs">{t._count?.posts ?? 0}</span>
                  </Link>
              ))}
              {tags.length === 0 && <div className="text-dim text-sm">{noTagsText ?? "No tags yet."}</div>}
            </div>
        )}
      </div>
  );
}
