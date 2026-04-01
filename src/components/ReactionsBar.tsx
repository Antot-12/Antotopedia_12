"use client";

import { useEffect, useMemo, useState } from "react";

const TYPES = ["likes", "love", "wow", "fire"] as const;
type TypeKey = (typeof TYPES)[number];
type Counts = Record<TypeKey, number>;

function normalizeCounts(src: any): Counts {
    return {
        likes: Number.isFinite(Number(src?.likes)) ? Number(src.likes) : 0,
        love: Number.isFinite(Number(src?.love)) ? Number(src.love) : 0,
        wow: Number.isFinite(Number(src?.wow)) ? Number(src.wow) : 0,
        fire: Number.isFinite(Number(src?.fire)) ? Number(src.fire) : 0,
    };
}

function ico(t: TypeKey) {
    if (t === "love") return "❤️";
    if (t === "fire") return "🔥";
    if (t === "wow") return "😮";
    return "👏";
}

export default function ReactionsBar({
                                         postId,
                                         initial,
                                         labels,
                                     }: {
    postId: number | string;
    initial?: any;
    labels?: {
        total?: string;
        like?: string;
        love?: string;
        wow?: string;
        fire?: string;
    };
}) {
    const [counts, setCounts] = useState<Counts>(() => normalizeCounts(initial));
    const [busy, setBusy] = useState<Partial<Record<TypeKey, boolean>>>({});
    const [userReactions, setUserReactions] = useState<Partial<Record<TypeKey, boolean>>>({});

    const total = useMemo(
        () => TYPES.reduce((s, k) => s + (Number(counts[k]) || 0), 0),
        [counts]
    );

    useEffect(() => {
        let alive = true;
        const load = async () => {
            try {
                const res = await fetch(`/api/posts/${postId}/reactions`, { cache: "no-store" });
                const data = await res.json().catch(() => ({}));
                if (!alive) return;
                setCounts(normalizeCounts(data));
            } catch {}
        };
        load();
        return () => {
            alive = false;
        };
    }, [postId]);

    // Load user reactions from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(`reactions_${postId}`);
        if (stored) {
            try {
                setUserReactions(JSON.parse(stored));
            } catch {}
        }
    }, [postId]);

    const bump = async (type: TypeKey) => {
        if (busy[type]) return;

        // Toggle: if user already reacted, remove it (-1), otherwise add it (+1)
        const hasReacted = userReactions[type];
        const delta = hasReacted ? -1 : 1;

        setBusy((b) => ({ ...b, [type]: true }));
        const prev = counts;
        const next = { ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) };
        setCounts(next);

        // Update user reactions state
        const newUserReactions = { ...userReactions, [type]: !hasReacted };
        setUserReactions(newUserReactions);
        localStorage.setItem(`reactions_${postId}`, JSON.stringify(newUserReactions));

        try {
            const res = await fetch(`/api/posts/${postId}/reactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, delta }),
            });
            const data = await res.json().catch(() => ({}));
            const server = normalizeCounts(data);
            setCounts(server);
        } catch {
            setCounts(prev);
            // Revert user reaction on error
            setUserReactions(userReactions);
            localStorage.setItem(`reactions_${postId}`, JSON.stringify(userReactions));
        } finally {
            setBusy((b) => ({ ...b, [type]: false }));
        }
    };

    const getLabel = (type: TypeKey) => {
        const labelMap: Record<TypeKey, string> = {
            likes: labels?.like || "Like",
            love: labels?.love || "Love",
            wow: labels?.wow || "Wow",
            fire: labels?.fire || "Fire",
        };
        return labelMap[type];
    };

    return (
        <div className="inline-flex items-center gap-2 w-fit self-start">
            {TYPES.map((t) => (
                <button
                    key={t}
                    type="button"
                    className={`btn ${userReactions[t] ? "btn-primary" : "btn-soft"} ${busy[t] ? "opacity-70" : ""} h-9 px-3 inline-flex items-center gap-2 active:scale-95`}
                    onClick={() => bump(t)}
                    aria-label={getLabel(t)}
                >
                    <span aria-hidden="true">{ico(t)}</span>
                    <span>{Number(counts[t]) || 0}</span>
                </button>
            ))}
            <span className="text-xs text-dim ml-1">{total} {labels?.total || "total"}</span>
        </div>
    );
}
