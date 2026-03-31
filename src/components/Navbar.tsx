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

// Language Switcher Component
function LanguageSwitcher({ locale }: { locale: string }) {
    const router = useRouter();
    const [switching, setSwitching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "uk", name: "Українська", flag: "🇺🇦" },
    ];

    const currentLang = languages.find(l => l.code === locale) || languages[0];

    const switchLanguage = async (newLocale: string) => {
        if (newLocale === locale) {
            setIsOpen(false);
            return;
        }

        setSwitching(true);
        setIsOpen(false);
        try {
            await fetch("/api/locale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locale: newLocale }),
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to switch language:", error);
        } finally {
            setSwitching(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={switching}
                className="btn btn-soft text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-1.5"
                title={currentLang.name}
            >
                <span className="text-base">{currentLang.flag}</span>
                <span className="hidden sm:inline font-semibold">{currentLang.code.toUpperCase()}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-50 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/10 transition-colors ${
                                lang.code === locale ? "bg-accent/20 text-accent" : ""
                            }`}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                            {lang.code === locale && (
                                <span className="ml-auto text-accent">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Mobile Menu Drawer Component
function MobileMenu({ isOpen, onClose, dict, user, locale, viewMode, onViewModeChange }: any) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const router = useRouter();

    const languages = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "uk", name: "Українська", flag: "🇺🇦" },
    ];

    const switchLanguage = async (newLocale: string) => {
        if (newLocale === locale) return;

        try {
            await fetch("/api/locale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locale: newLocale }),
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to switch language:", error);
        }
    };

    // Swipe to close gesture
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - touchStart;
        if (diff > 0) setDragOffset(diff);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (dragOffset > 100) onClose();
        setDragOffset(0);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setIsAnimating(true);
        } else {
            document.body.style.overflow = "";
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
            {/* Backdrop with fade-in animation */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300 ease-out ${
                    isOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />

            {/* Drawer with slide-in animation */}
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`fixed top-0 right-0 h-full w-[300px] bg-gradient-to-br from-[#0f151c] to-[#141b24] border-l border-accent/20 z-[70] shadow-[0_0_60px_rgba(46,231,216,0.15)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-[120%] opacity-0 scale-95"
                }`}
                style={{
                    transform: isDragging && dragOffset > 0
                        ? `translateX(${dragOffset}px)`
                        : undefined,
                    transition: isDragging ? "none" : undefined
                }}
            >
                <div className="flex flex-col h-full relative">
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

                    {/* Swipe indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-accent/30 rounded-r-full" />

                    {/* Header */}
                    <div className={`relative p-6 border-b border-accent/20 ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`} style={{
                        transitionProperty: "all",
                        transitionDuration: "300ms",
                        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                        transitionDelay: isOpen ? "50ms" : "0ms"
                    }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-8 bg-accent rounded-full shadow-[0_0_12px_rgba(46,231,216,0.6)] animate-pulse" />
                                <h2 className="text-xl font-bold text-accent tracking-tight">{dict.nav.brand}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl hover:bg-accent/10 hover:rotate-90 active:scale-95 flex items-center justify-center transition-all duration-300 border border-transparent hover:border-accent/30"
                                aria-label="Close menu"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links - TOP */}
                    <nav className="relative flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="space-y-2">
                            <Link
                                href="/blog"
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] active:scale-[0.98] ${
                                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                }`}
                                style={{
                                    transitionProperty: "all",
                                    transitionDuration: "300ms",
                                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                                    transitionDelay: isOpen ? "100ms" : "0ms"
                                }}
                                onClick={onClose}
                            >
                                <span className="text-2xl group-hover:scale-110 group-active:scale-90 transition-transform duration-200">📝</span>
                                <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.blog}</span>
                            </Link>
                            <Link
                                href="/tags"
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] active:scale-[0.98] ${
                                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                }`}
                                style={{
                                    transitionProperty: "all",
                                    transitionDuration: "300ms",
                                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                                    transitionDelay: isOpen ? "150ms" : "0ms"
                                }}
                                onClick={onClose}
                            >
                                <span className="text-2xl group-hover:scale-110 group-active:scale-90 transition-transform duration-200">🏷️</span>
                                <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.tags}</span>
                            </Link>
                            <Link
                                href="/search"
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] active:scale-[0.98] ${
                                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                }`}
                                style={{
                                    transitionProperty: "all",
                                    transitionDuration: "300ms",
                                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                                    transitionDelay: isOpen ? "200ms" : "0ms"
                                }}
                                onClick={onClose}
                            >
                                <span className="text-2xl group-hover:scale-110 group-active:scale-90 transition-transform duration-200">🔍</span>
                                <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.search}</span>
                            </Link>

                            {user && (
                                <>
                                    {/* Separator */}
                                    <div className={`relative my-4 ${
                                        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                    }`} style={{
                                        transitionProperty: "all",
                                        transitionDuration: "250ms",
                                        transitionTimingFunction: "ease-out",
                                        transitionDelay: isOpen ? "250ms" : "0ms"
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
                                        className={`flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/15 hover:to-accent/5 group border border-transparent hover:border-accent/30 hover:shadow-[0_0_20px_rgba(46,231,216,0.1)] active:scale-[0.98] ${
                                            isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                        }`}
                                        style={{
                                            transitionProperty: "all",
                                            transitionDuration: "300ms",
                                            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                                            transitionDelay: isOpen ? "300ms" : "0ms"
                                        }}
                                        onClick={onClose}
                                    >
                                        <span className="text-2xl group-hover:scale-110 group-active:scale-90 transition-transform duration-200">⚙️</span>
                                        <span className="font-semibold text-base group-hover:text-accent transition-colors">{dict.nav.admin}</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Footer - BOTTOM with User Info, View Mode, Language */}
                    <div className={`relative border-t border-accent/20 ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`} style={{
                        transitionProperty: "all",
                        transitionDuration: "300ms",
                        transitionTimingFunction: "ease-out",
                        transitionDelay: isOpen ? "350ms" : "0ms"
                    }}>
                        <div className="p-6 space-y-4">
                            {/* User Info */}
                            {user && (
                                <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-lg font-bold text-accent">
                                        {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "A"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-xs truncate">{user.name || user.email}</div>
                                        <div className="text-[10px] text-dim truncate">{user.email}</div>
                                    </div>
                                </div>
                            )}

                            {/* View Mode Toggle */}
                            <div>
                                <div className="text-[10px] text-accent/60 uppercase tracking-wider mb-2">{dict.nav.viewMode || "View Mode"}</div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onViewModeChange("grid")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border active:scale-95 transition-all ${
                                            viewMode === "grid"
                                                ? "bg-accent/20 text-accent border-accent/40"
                                                : "border-white/10 hover:bg-accent/10"
                                        }`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="7" height="7" />
                                            <rect x="14" y="3" width="7" height="7" />
                                            <rect x="3" y="14" width="7" height="7" />
                                            <rect x="14" y="14" width="7" height="7" />
                                        </svg>
                                        <span className="text-xs font-medium">{dict.nav.gridView || "Grid"}</span>
                                    </button>
                                    <button
                                        onClick={() => onViewModeChange("list")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border active:scale-95 transition-all ${
                                            viewMode === "list"
                                                ? "bg-accent/20 text-accent border-accent/40"
                                                : "border-white/10 hover:bg-accent/10"
                                        }`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="8" y1="6" x2="21" y2="6" />
                                            <line x1="8" y1="12" x2="21" y2="12" />
                                            <line x1="8" y1="18" x2="21" y2="18" />
                                            <line x1="3" y1="6" x2="3.01" y2="6" />
                                            <line x1="3" y1="12" x2="3.01" y2="12" />
                                            <line x1="3" y1="18" x2="3.01" y2="18" />
                                        </svg>
                                        <span className="text-xs font-medium">{dict.nav.listView || "List"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Language Switcher - Vertical List */}
                            <div>
                                <div className="text-[10px] text-accent/60 uppercase tracking-wider mb-2">{dict.nav.language || "Language"}</div>
                                <div className="space-y-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => switchLanguage(lang.code)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg active:scale-[0.98] transition-all duration-200 ${
                                                lang.code === locale
                                                    ? "bg-accent/20 text-accent border-2 border-accent/60 shadow-[0_0_12px_rgba(46,231,216,0.2)]"
                                                    : "hover:bg-white/5 border-2 border-transparent hover:border-white/10"
                                            }`}
                                        >
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className="font-medium text-sm flex-1 text-left">{lang.name}</span>
                                            {lang.code === locale && (
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-black">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Logout Button */}
                            {user && (
                                <form action="/api/auth/logout" method="post" className="w-full pt-2">
                                    <button className="flex items-center justify-center gap-4 w-full px-5 py-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 active:scale-[0.98] transition-all duration-200 text-left group border border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                        <span className="text-2xl group-hover:scale-110 group-active:scale-90 transition-transform duration-200">🚪</span>
                                        <span className="font-bold text-base text-red-400 group-hover:text-red-300 transition-colors">{dict.nav.logout || "Logout"}</span>
                                    </button>
                                </form>
                            )}
                        </div>
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
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
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

                        {/* Language Switcher */}
                        <LanguageSwitcher locale={locale} />

                        {user ? (
                            <>
                                <Link href="/admin" className="btn btn-primary text-xs sm:text-sm px-2 sm:px-4">{dict.nav.admin}</Link>
                                <form action="/api/auth/logout" method="post">
                                    <button className="btn btn-ghost text-xs sm:text-sm px-2 sm:px-4">{dict.nav.logout || "Logout"}</button>
                                </form>
                            </>
                        ) : null}
                    </nav>

                    {/* Mobile: Hamburger Menu with animation */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className={`md:hidden btn btn-ghost w-10 h-10 p-0 group relative overflow-hidden transition-all duration-300 ${
                            mobileMenuOpen ? "scale-90 rotate-90" : "scale-100 rotate-0"
                        }`}
                        aria-label="Open menu"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="relative z-10 transition-all duration-300 group-hover:scale-110 group-active:scale-95"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" className="transition-all duration-300 origin-center group-hover:translate-x-1" style={{
                                transformOrigin: "center"
                            }} />
                            <line x1="3" y1="6" x2="21" y2="6" className="transition-all duration-300 origin-center group-hover:translate-x-0.5" style={{
                                transformOrigin: "center"
                            }} />
                            <line x1="3" y1="18" x2="21" y2="18" className="transition-all duration-300 origin-center group-hover:translate-x-0.5" style={{
                                transformOrigin: "center"
                            }} />
                        </svg>
                        {/* Ripple effect */}
                        <span className="absolute inset-0 rounded-xl bg-accent/20 scale-0 group-hover:scale-100 group-active:scale-110 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
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
