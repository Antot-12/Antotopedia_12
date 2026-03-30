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
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setIsAnimating(true);
        } else {
            document.body.style.overflow = "";
            // Delay to allow exit animation
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen && !isAnimating) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] ${
                    isOpen ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    transitionProperty: "opacity",
                    transitionDuration: "400ms",
                    transitionTimingFunction: "ease-out"
                }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[300px] bg-gradient-to-br from-[#0f151c] to-[#141b24] border-l border-accent/20 z-[70] shadow-[0_0_60px_rgba(46,231,216,0.15)] ${
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
                style={{
                    transitionProperty: "transform, opacity",
                    transitionDuration: "500ms",
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
            >
                <div className="flex flex-col h-full relative">
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

                    {/* Header with stagger animation */}
                    <div className={`relative flex items-center justify-between p-6 border-b border-accent/20 ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
                    }`} style={{
                        transitionProperty: "all",
                        transitionDuration: "500ms",
                        transitionTimingFunction: "ease-out",
                        transitionDelay: isOpen ? "200ms" : "0ms"
                    }}>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-8 bg-accent rounded-full shadow-[0_0_12px_rgba(46,231,216,0.6)] animate-pulse" />
                            <h2 className="text-xl font-bold text-accent tracking-tight">{dict.nav.brand}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-accent/10 hover:rotate-90 flex items-center justify-center transition-all duration-300 border border-transparent hover:border-accent/30"
                            aria-label="Close menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links with stagger animation */}
                    <nav className="relative flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="space-y-2">
                            <Link
                                href="/blog"
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] ${
                                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                }`}
                                style={{
                                    transitionProperty: "all",
                                    transitionDuration: "500ms",
                                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    transitionDelay: isOpen ? "300ms" : "0ms"
                                }}
                                onClick={onClose}
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📝</span>
                                <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.blog}</span>
                            </Link>
                            <Link
                                href="/tags"
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] ${
                                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                }`}
                                style={{
                                    transitionProperty: "all",
                                    transitionDuration: "500ms",
                                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    transitionDelay: isOpen ? "400ms" : "0ms"
                                }}
                                onClick={onClose}
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🏷️</span>
                                <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.tags}</span>
                            </Link>
                            <Link
                                href="/search"
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] ${
                                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                }`}
                                style={{
                                    transitionProperty: "all",
                                    transitionDuration: "500ms",
                                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    transitionDelay: isOpen ? "500ms" : "0ms"
                                }}
                                onClick={onClose}
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🔍</span>
                                <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.search}</span>
                            </Link>

                            {user && (
                                <>
                                    <div className={`relative my-6 ${
                                        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                    }`} style={{
                                        transitionProperty: "all",
                                        transitionDuration: "400ms",
                                        transitionTimingFunction: "ease-out",
                                        transitionDelay: isOpen ? "600ms" : "0ms"
                                    }}>
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-accent/20" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-[#0f151c] px-3 text-xs text-accent/60 uppercase tracking-wider">Admin</span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/admin"
                                        className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] ${
                                            isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                        }`}
                                        style={{
                                            transitionProperty: "all",
                                            transitionDuration: "500ms",
                                            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                                            transitionDelay: isOpen ? "700ms" : "0ms"
                                        }}
                                        onClick={onClose}
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform duration-200">⚙️</span>
                                        <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.admin}</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Footer Actions with animation */}
                    <div className={`relative p-6 border-t border-accent/20 ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`} style={{
                        transitionProperty: "all",
                        transitionDuration: "500ms",
                        transitionTimingFunction: "ease-out",
                        transitionDelay: isOpen ? "800ms" : "0ms"
                    }}>
                        {user ? (
                            <form action="/api/auth/logout" method="post" className="w-full">
                                <button className="flex items-center justify-center gap-4 w-full px-5 py-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-200 text-left group border border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🚪</span>
                                    <span className="font-bold text-base text-red-400 group-hover:text-red-300 transition-colors">Logout</span>
                                </button>
                            </form>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-xl bg-gradient-to-r from-accent/15 to-accent/10 hover:from-accent/25 hover:to-accent/15 border border-accent/40 hover:border-accent transition-all duration-200 font-bold text-base text-accent hover:shadow-[0_0_24px_rgba(46,231,216,0.3)]"
                                onClick={onClose}
                            >
                                <span className="text-xl">🔑</span>
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

                    {/* Mobile: Hamburger Menu with animation */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden btn btn-ghost w-10 h-10 p-0 group relative overflow-hidden"
                        aria-label="Open menu"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" className="transition-transform duration-300 group-hover:translate-x-1" />
                            <line x1="3" y1="6" x2="21" y2="6" className="transition-transform duration-300 group-hover:translate-x-0.5" />
                            <line x1="3" y1="18" x2="21" y2="18" className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </svg>
                        {/* Ripple effect on hover */}
                        <span className="absolute inset-0 rounded-xl bg-accent/20 scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
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
