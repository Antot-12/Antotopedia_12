"use client";

import useSWR from "swr";
import { useState } from "react";

const fetcher = (u: string) => fetch(u, { cache: "no-store" }).then((r) => r.json());

type Props = {
    postId: number | string;
    compact?: boolean;
    className?: string;
};

const EMOJI: Record<string, string> = {
    likes: "👍",
    love: "💖",
    wow: "😮",
    fire: "🔥",
};

export default function Reactions({ postId, compact, className }: Props) {
    const url = `/api/posts/${postId}/reactions`;
    const { data, mutate, isLoading } = useSWR(url, fetcher);
    const [popping, setPopping] = useState<string | null>(null);

    const act = async (type: "likes" | "love" | "wow" | "fire", delta = 1) => {
        setPopping(type);
        mutate(
            (prev: any) => ({
                ...(prev || { likes: 0, love: 0, wow: 0, fire: 0 }),
                [type]: Math.max(0, ((prev || {})[type] ?? 0) + delta),
            }),
            { revalidate: false }
        );
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, delta }),
        }).catch(() => {});
        setTimeout(() => setPopping(null), 300);
        mutate();
    };

    const counts = data || { likes: 0, love: 0, wow: 0, fire: 0 };

    if (compact) {
        return (
            <div className={`flex items-center gap-3 ${className || ""}`}>
                {Object.entries(EMOJI).map(([k, e]) => (
                    <div key={k} className="text-sm text-white/70">
                        <span className="mr-1">{e}</span>
                        {isLoading ? "…" : counts[k as keyof typeof counts] ?? 0}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`flex flex-wrap gap-3 ${className || ""}`}>
            {(
                [
                    ["likes", "Like"],
                    ["love", "Love"],
                    ["wow", "Wow"],
                    ["fire", "Fire"],
                ] as const
            ).map(([k, label]) => (
                <button
                    key={k}
                    type="button"
                    onClick={() => act(k)}
                    className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm hover:border-accent hover:text-accent transition ${
                        popping === k ? "scale-105" : ""
                    }`}
                >
                    <span aria-hidden="true">{EMOJI[k]}</span>
                    <span>{isLoading ? "…" : counts[k as keyof typeof counts] ?? 0}</span>
                    <span className="sr-only">{label}</span>
                </button>
            ))}
        </div>
    );
}
