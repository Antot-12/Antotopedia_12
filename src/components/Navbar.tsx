"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type NavbarProps = {
    user: any;
    locale: string;
    dict: any;
    initialViewMode?: "grid" | "list";
};

// Mobile Menu Drawer Component
function MobileMenu({ isOpen, onClose, dict, user, locale }: any) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-card border-l border-border z-50 shadow-2xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-accent">{dict.nav.brand}</h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                            aria-label="Close menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            <Link
                                href="/blog"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors"
                                onClick={onClose}
                            >
                                <span className="text-xl">📝</span>
                                <span className="font-medium">{dict.nav.blog}</span>
                            </Link>
                            <Link
                                href="/tags"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors"
                                onClick={onClose}
                            >
                                <span className="text-xl">🏷️</span>
                                <span className="font-medium">{dict.nav.tags}</span>
                            </Link>
                            <Link
                                href="/search"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors"
                                onClick={onClose}
                            >
                                <span className="text-xl">🔍</span>
                                <span className="font-medium">{dict.nav.search}</span>
                            </Link>

                            {user && (
                                <>
                                    <div className="border-t border-border my-2" />
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors"
                                        onClick={onClose}
                                    >
                                        <span className="text-xl">⚙️</span>
                                        <span className="font-medium">{dict.nav.admin}</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-border space-y-2">
                        {user ? (
                            <form action="/api/auth/logout" method="post" className="w-full">
                                <button className="btn btn-ghost w-full justify-start">
                                    <span className="text-xl mr-3">🚪</span>
                                    Logout
                                </button>
                            </form>
                        ) : (
                            <Link href="/login" className="btn btn-primary w-full" onClick={onClose}>
                                <span className="text-xl mr-2">🔑</span>
                                {dict.nav.login_aria}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// Live Search Component
function LiveSearch({ dict, locale }: any) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data.results || []);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            router.push(`/blog?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={searchRef} className="relative flex-1 max-w-md">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setIsOpen(true)}
                        placeholder={dict.nav.search_placeholder}
                        className="input w-full pr-10"
                    />
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary whitespace-nowrap">
                    {dict.nav.search}
                </button>
            </form>

            {/* Autocomplete Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.map((result) => (
                        <Link
                            key={result.id}
                            href={`/blog/${result.slug}`}
                            className="flex items-start gap-3 p-3 hover:bg-accent/10 transition-colors border-b border-border last:border-b-0"
                            onClick={() => {
                                setIsOpen(false);
                                setQuery("");
                            }}
                        >
                            {result.coverImageUrl && (
                                <img
                                    src={result.coverImageUrl}
                                    alt={result.title}
                                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1">{result.title}</h4>
                                {result.description && (
                                    <p className="text-xs text-dim line-clamp-2 mt-1">{result.description}</p>
                                )}
                                {result.tags && result.tags.length > 0 && (
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {result.tags.slice(0, 3).map((tag: any) => (
                                            <span key={tag.name} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && !loading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl p-4 text-center text-dim text-sm z-50">
                    No results found for "{query}"
                </div>
            )}
        </div>
    );
}

export default function Navbar({ user, locale, dict, initialViewMode = "grid" }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode);

    // Load view mode from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("viewMode") as "grid" | "list" | null;
        if (saved) {
            setViewMode(saved);
        }
    }, []);

    // Save view mode to localStorage and emit event
    const handleViewModeChange = (mode: "grid" | "list") => {
        setViewMode(mode);
        localStorage.setItem("viewMode", mode);
        // Emit custom event for other components to listen
        window.dispatchEvent(new CustomEvent("viewModeChange", { detail: mode }));
    };

    return (
        <>
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                dict={dict}
                user={user}
                locale={locale}
            />

            <div className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
                <div className="container-narrow h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
                    <Link href="/" className="text-base sm:text-xl font-semibold tracking-tight text-accent flex-shrink-0">
                        {dict.nav.brand}
                    </Link>

                    {/* Desktop Search with Live Autocomplete */}
                    <div className="hidden lg:flex items-center gap-2 flex-1">
                        <LiveSearch dict={dict} locale={locale} />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 mr-2">
                            <button
                                onClick={() => handleViewModeChange("grid")}
                                className={`btn btn-soft px-2 h-9 transition-colors ${
                                    viewMode === "grid" ? "bg-accent/20 text-accent" : ""
                                }`}
                                title="Grid view"
                                aria-label="Grid view"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleViewModeChange("list")}
                                className={`btn btn-soft px-2 h-9 transition-colors ${
                                    viewMode === "list" ? "bg-accent/20 text-accent" : ""
                                }`}
                                title="List view"
                                aria-label="List view"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <Link href="/blog" className="btn btn-soft text-xs sm:text-sm px-2 sm:px-4">{dict.nav.blog}</Link>
                        <Link href="/tags" className="btn btn-soft text-xs sm:text-sm px-2 sm:px-4">{dict.nav.tags}</Link>
                        <Link href="/search" className="btn btn-soft text-xs sm:text-sm px-2 sm:px-4" title="Search">🔍</Link>
                        {user ? (
                            <>
                                <Link href="/admin" className="btn btn-primary text-xs sm:text-sm px-2 sm:px-4">{dict.nav.admin}</Link>
                                <form action="/api/auth/logout" method="post">
                                    <button className="btn btn-ghost text-xs sm:text-sm px-2 sm:px-4">Logout</button>
                                </form>
                            </>
                        ) : (
                            <Link href="/login" aria-label={dict.nav.login_aria} title={dict.nav.login_aria} className="btn btn-ghost w-10 h-10 p-0 text-base sm:text-lg">🔑</Link>
                        )}
                    </nav>

                    {/* Mobile: Hamburger Menu */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden btn btn-ghost w-10 h-10 p-0"
                        aria-label="Open menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Search Bar with Live Search */}
                <div className="lg:hidden border-t border-white/5 px-4 py-2">
                    <LiveSearch dict={dict} locale={locale} />
                </div>
            </div>
        </>
    );
}
