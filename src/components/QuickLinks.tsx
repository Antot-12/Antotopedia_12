import Link from "next/link";
import { getLocale, getDictionary } from "@/lib/i18n";

function SearchIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" opacity="0.7" />
            <path d="M18 3L19 6L22 7L19 8L18 11L17 8L14 7L17 6L18 3Z" />
        </svg>
    );
}

function TagIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <circle cx="7" cy="7" r="1" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}

function LightbulbIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
        </svg>
    );
}

export default async function QuickLinks() {
    const locale = await getLocale();
    const dict = await getDictionary(locale);
    const t = dict.quickLinks || {};

    return (
        <aside className="grid gap-4">
            <div className="card p-6 grid gap-5">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent/50 rounded-full" />
                    <h2 className="text-xl font-semibold">{t.heading || "Quick Links"}</h2>
                </div>

                <form action="/blog" className="grid gap-3">
                    <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            name="q"
                            placeholder={t.searchPlaceholder || "Search posts..."}
                            className="input pl-12 pr-4 w-full bg-muted/30 border-muted hover:border-accent/50 focus:border-accent transition-all"
                        />
                    </div>
                    <button className="btn btn-primary h-11 font-medium shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all">
                        {t.searchButton || "Search"}
                    </button>
                </form>

                <div className="grid gap-2">
                    <Link
                        href="/blog"
                        className="btn btn-soft h-11 justify-start gap-3 hover:bg-accent/10 hover:border-accent/50 hover:translate-x-1 transition-all group"
                    >
                        <SparklesIcon />
                        <span className="group-hover:text-accent transition-colors">{t.latestPosts || "Latest Posts"}</span>
                    </Link>
                    <Link
                        href="/tags"
                        className="btn btn-soft h-11 justify-start gap-3 hover:bg-accent/10 hover:border-accent/50 hover:translate-x-1 transition-all group"
                    >
                        <TagIcon />
                        <span className="group-hover:text-accent transition-colors">{t.allTags || "All Tags"}</span>
                    </Link>
                    <Link
                        href="/blog?q=guide"
                        className="btn btn-soft h-11 justify-start gap-3 hover:bg-accent/10 hover:border-accent/50 hover:translate-x-1 transition-all group"
                    >
                        <BookIcon />
                        <span className="group-hover:text-accent transition-colors">{t.guides || "Guides"}</span>
                    </Link>
                    <Link
                        href="/blog?q=tips"
                        className="btn btn-soft h-11 justify-start gap-3 hover:bg-accent/10 hover:border-accent/50 hover:translate-x-1 transition-all group"
                    >
                        <LightbulbIcon />
                        <span className="group-hover:text-accent transition-colors">{t.tipsTricks || "Tips & Tricks"}</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
