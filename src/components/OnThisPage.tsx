"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

type TocItem = {
    id: string;
    text: string;
    level: 2 | 3;
    readingTime?: number; // in seconds
};

type Props = {
    items: TocItem[];
    baseUrl?: string;
    labels?: {
        heading?: string;
        hide?: string;
        show?: string;
        noSections?: string;
        backToTop?: string;
        progress?: string;
        readingTime?: string;
        minRead?: string;
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

function ClockIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}

// Estimate reading time based on text length (average 200 words per minute)
function estimateReadingTime(text: string): number {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil((words / 200) * 60); // returns seconds
}

function formatReadingTime(seconds: number, minLabel: string): string {
    const mins = Math.ceil(seconds / 60);
    return `${mins} ${minLabel}`;
}

export default function OnThisPage({ items, baseUrl, labels }: Props) {
    const [active, setActive] = useState<string | null>(null);
    const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
    const [open, setOpen] = useState(() => {
        // Load saved state from localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("onThisPage:open");
            return saved !== null ? saved === "true" : true;
        }
        return true;
    });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const ids = useMemo(() => items.map(i => i.id), [items]);

    // Calculate reading times for items
    const itemsWithTime = useMemo(() => {
        return items.map(item => {
            if (item.readingTime) return item;
            // Estimate based on heading text if no content available
            return { ...item, readingTime: estimateReadingTime(item.text) };
        });
    }, [items]);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Save open state to localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("onThisPage:open", String(open));
        }
    }, [open]);

    // Track scroll progress
    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
        };

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    useEffect(() => {
        if (!ids.length) return;
        const obs = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target?.id) {
                    const sectionId = visible[0].target.id;
                    setActive(sectionId);
                    // Mark section as visited
                    setVisitedSections(prev => new Set(prev).add(sectionId));
                }
            },
            { rootMargin: "-140px 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [ids]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Only trigger if not in input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const currentIndex = active ? ids.indexOf(active) : -1;

            if (e.key === "ArrowUp" && e.altKey && currentIndex > 0) {
                e.preventDefault();
                const prevId = ids[currentIndex - 1];
                document.getElementById(prevId)?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (e.key === "ArrowDown" && e.altKey && currentIndex < ids.length - 1) {
                e.preventDefault();
                const nextId = ids[currentIndex + 1];
                document.getElementById(nextId)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [ids, active]);

    const copyAnchor = async (id: string) => {
        const url = baseUrl ? `${baseUrl}#${id}` : `${location.origin}${location.pathname}#${id}`;
        try { await navigator.clipboard.writeText(url); } catch {}
    };

    const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" not found`);
            return;
        }

        const offset = 140;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // Mark as visited
        setVisitedSections(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });

        if (isMobile) setMobileOpen(false);
    }, [isMobile]);

    const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        console.log('handleNavClick called with id:', id);
        e.preventDefault();
        e.stopPropagation();
        scrollToSection(id);
    }, [scrollToSection]);

    // Calculate progress and remaining time
    const currentIndex = useMemo(() => {
        if (!active) return 0;
        const foundIndex = items.findIndex(item => item.id === active);
        return foundIndex !== -1 ? foundIndex : 0;
    }, [active, items]);

    const completedSections = visitedSections.size;
    const totalSections = ids.length;
    const sectionProgress = totalSections > 0 ? Math.round((visitedSections.size / totalSections) * 100) : 0;

    const remainingTime = useMemo(() => {
        // Calculate remaining time based on unvisited sections
        const unvisitedItems = itemsWithTime.filter(item => !visitedSections.has(item.id));
        const remaining = unvisitedItems.reduce((sum, item) => sum + (item.readingTime || 0), 0);
        return remaining;
    }, [itemsWithTime, visitedSections]);

    const t = {
        heading: labels?.heading ?? "On this page",
        hide: labels?.hide ?? "Hide",
        show: labels?.show ?? "Show",
        noSections: labels?.noSections ?? "No sections",
        backToTop: labels?.backToTop ?? "Back to top",
        progress: labels?.progress ?? "Progress",
        readingTime: labels?.readingTime ?? "Reading time",
        minRead: labels?.minRead ?? "min",
    };

    // Desktop TOC content
    const tocContent = (
        <>
            {/* Progress Section */}
            {items.length > 0 && (
                <div className="grid gap-2 pb-2 border-b border-border">
                    <div className="flex items-center justify-between text-xs text-dim">
                        <span className="flex items-center gap-1">
                            <ClockIcon />
                            {t.readingTime}
                        </span>
                        <span>{formatReadingTime(remainingTime, t.minRead)}</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-dim">{t.progress}</span>
                            <span className="font-medium">{sectionProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent transition-all duration-300"
                                style={{ width: `${scrollProgress}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-xs text-dim">
                        {completedSections} of {totalSections} sections
                    </div>
                </div>
            )}

            {open && items.length > 0 ? (
                <nav className="grid gap-1">
                    {items.map((it, idx) => {
                        const isActive = active === it.id;
                        const isCompleted = visitedSections.has(it.id) && !isActive;

                        return (
                            <div
                                key={`${it.id}-${idx}`}
                                className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? "bg-accent/15 shadow-sm border-l-2 border-accent"
                                        : isCompleted
                                        ? "bg-green-500/5 border-l-2 border-green-500/30"
                                        : "hover:bg-muted/50 border-l-2 border-transparent"
                                }`}
                                onClick={() => scrollToSection(it.id)}
                            >
                                {/* Progress dot */}
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                                            isCompleted
                                                ? "bg-green-500 scale-100"
                                                : isActive
                                                ? "bg-accent ring-2 ring-accent/30 scale-125 shadow-[0_0_8px_rgba(var(--accent-rgb),0.4)]"
                                                : "bg-muted/50 scale-90"
                                        }`}
                                    >
                                        {isCompleted && (
                                            <svg
                                                width="10"
                                                height="10"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                className="text-white"
                                            >
                                                <path
                                                    d="M2 6l2.5 2.5L10 3"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <span
                                    className={`truncate text-sm flex-1 transition-all duration-200 text-left ${
                                        it.level === 3 ? "pl-4" : ""
                                    } ${
                                        isActive
                                            ? "text-accent font-semibold tracking-wide"
                                            : isCompleted
                                            ? "text-green-600 dark:text-green-400 font-medium line-through decoration-green-500/40 decoration-1"
                                            : "text-muted-foreground hover:text-accent hover:translate-x-0.5"
                                    }`}
                                >
                                    {it.text}
                                </span>

                                <button
                                    aria-label="Copy section link"
                                    className="btn btn-ghost px-1.5 py-1 text-xs opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity flex-shrink-0"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        copyAnchor(it.id);
                                    }}
                                >
                                    <LinkIcon />
                                </button>
                            </div>
                        );
                    })}
                </nav>
            ) : (
                open && <div className="text-dim text-sm">{t.noSections}</div>
            )}

            <button
                onClick={scrollTop}
                className="btn btn-primary w-full h-9 text-xs inline-flex items-center justify-center gap-2"
            >
                <ArrowUpIcon /> {t.backToTop}
            </button>
        </>
    );

    return (
        <>
            {/* Mobile FAB */}
            {isMobile && (
                <>
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-accent/90 hover:bg-accent shadow-lg flex items-center justify-center md:hidden transition-all hover:scale-110"
                        aria-label={t.heading}
                        style={{ backdropFilter: 'blur(8px)' }}
                    >
                        <MenuIcon />
                    </button>

                    {/* Mobile Drawer Overlay */}
                    {mobileOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                    )}

                    {/* Mobile Drawer */}
                    <div
                        className={`fixed bottom-0 left-0 right-0 bg-[#0f151c] border-t-2 border-accent/50 rounded-t-2xl shadow-2xl z-50 transition-transform duration-300 md:hidden max-h-[80vh] overflow-y-auto ${
                            mobileOpen ? "translate-y-0" : "translate-y-full"
                        }`}
                        style={{ background: 'linear-gradient(to bottom, rgba(15, 21, 28, 0.98), rgba(15, 21, 28, 1))' }}
                    >
                        <div className="p-4 grid gap-3">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h3 className="text-sm font-semibold">{t.heading}</h3>
                                <button
                                    className="btn btn-soft px-3 py-1.5 text-xs"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                            {tocContent}
                        </div>
                    </div>
                </>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="card p-4 grid gap-3 sticky top-24">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">{t.heading}</h3>
                        <button
                            className="btn btn-soft px-2 py-1 text-xs"
                            onClick={() => setOpen(s => !s)}
                            aria-expanded={open}
                        >
                            {open ? t.hide : t.show}
                        </button>
                    </div>
                    {tocContent}
                </div>
            )}
        </>
    );
}
