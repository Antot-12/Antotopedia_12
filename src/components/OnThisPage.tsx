"use client";

import { useEffect, useMemo, useState } from "react";

type TocItem = { id: string; text: string; level: 2 | 3 };
type Props = {
    items: TocItem[];
    baseUrl?: string;
    labels?: {
        heading?: string;
        hide?: string;
        show?: string;
        noSections?: string;
        backToTop?: string;
    };
};

function LinkIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.9 12a4.1 4.1 0 0 1 4.1-4.1h3v2h-3a2.1 2.1 0 0 0 0 4.2h3v2h-3A4.1 4.1 0 0 1 3.9 12Zm12-4.1h-3v2h3a2.1 2.1 0 0 1 0 4.2h-3v2h3a4.1 4.1 0 0 0 0-8.2Z" />
            <path d="M8 11h8v2H8z" />
        </svg>
    );
}

function ArrowUpIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 5l7 7-1.4 1.4L13 9.8V20h-2V9.8L6.4 13.4 5 12z" />
        </svg>
    );
}

export default function OnThisPage({ items, baseUrl, labels }: Props) {
    const [active, setActive] = useState<string | null>(null);
    const [open, setOpen] = useState(true);
    const ids = useMemo(() => items.map(i => i.id), [items]);

    useEffect(() => {
        if (!ids.length) return;
        const obs = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target?.id) setActive(visible[0].target.id);
            },
            { rootMargin: "0px 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
        );
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [ids]);

    const copyAnchor = async (id: string) => {
        const url = baseUrl ? `${baseUrl}#${id}` : `${location.origin}${location.pathname}#${id}`;
        try { await navigator.clipboard.writeText(url); } catch {}
    };

    const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const t = {
        heading: labels?.heading ?? "On this page",
        hide: labels?.hide ?? "Hide",
        show: labels?.show ?? "Show",
        noSections: labels?.noSections ?? "No sections",
        backToTop: labels?.backToTop ?? "Back to top",
    };

    return (
        <div className="card p-4 grid gap-3 sticky top-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{t.heading}</h3>
                <button className="btn btn-soft px-2 py-1 text-xs" onClick={() => setOpen(s => !s)} aria-expanded={open}>
                    {open ? t.hide : t.show}
                </button>
            </div>

            {open && items.length > 0 ? (
                <nav className="grid gap-1">
                    {items.map(it => (
                        <div key={it.id} className={`flex items-center justify-between rounded-lg px-2 py-1 ${active === it.id ? "bg-accent/10" : ""}`}>
                            <a href={`#${it.id}`} className={`truncate text-sm hover:text-accent ${it.level === 3 ? "pl-4" : ""} ${active === it.id ? "text-accent" : ""}`}>
                                {it.text}
                            </a>
                            <button aria-label="Copy section link" className="btn btn-ghost px-2 py-1 text-xs" onClick={() => copyAnchor(it.id)}>
                                <LinkIcon />
                            </button>
                        </div>
                    ))}
                </nav>
            ) : (
                <div className="text-dim text-sm">{t.noSections}</div>
            )}

            <button onClick={scrollTop} className="btn btn-primary w-full h-9 text-xs inline-flex items-center justify-center gap-2">
                <ArrowUpIcon /> {t.backToTop}
            </button>
        </div>
    );
}
