"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type Tag = { name: string; slug?: string | null };
type Post = {
    id: number | string;
    slug?: string | null;
    title?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    createdAt?: string | Date | null;
    tags?: Tag[] | null;
    viewCount?: number;
    isNew?: boolean;
    isTrending?: boolean;
    isUpdated?: boolean;
};

function readingTime(text?: string | null) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    const min = Math.max(1, Math.round(words / 200));
    return `${min} min read`;
}

// Status Badge Component
function StatusBadge({ type, label }: { type: "new" | "trending" | "updated"; label: string }) {
    const styles = {
        new: "bg-green-500/20 text-green-400 border-green-500/40",
        trending: "bg-orange-500/20 text-orange-400 border-orange-500/40",
        updated: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    };

    const icons = {
        new: "✨",
        trending: "🔥",
        updated: "🔄",
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${styles[type]}`}>
            <span>{icons[type]}</span>
            {label}
        </span>
    );
}

export default function PostCard({
    post,
    featured = false,
    infoCentered = true,
    maxTags = 4,
    bordered = true,
    locale,
    labels,
    viewMode = "grid", // grid or list
}: {
    post: Post | undefined;
    featured?: boolean;
    infoCentered?: boolean;
    maxTags?: number;
    bordered?: boolean;
    locale?: "en" | "uk";
    labels?: {
        read?: string;
        featured?: string;
        new?: string;
        trending?: string;
        updated?: string;
        views?: string;
    };
    viewMode?: "grid" | "list";
}) {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showAllTags, setShowAllTags] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    if (!post || !post.slug || !post.title) return null;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowQuickActions(false);
            }
        };

        if (showQuickActions) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showQuickActions]);

    const href = `/blog/${post.slug}`;
    const metaBase = readingTime(`${post.title} ${post.description || ""}`);
    const meta =
        locale === "uk"
            ? metaBase.replace("min read", "хв читання")
            : metaBase;

    const created = post.createdAt
        ? new Date(post.createdAt as any).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        : undefined;
    const imgSrc = post.coverImageUrl || "/no_image.jpg";
    const ringCls = bordered ? "ring-1 ring-white/10 hover:ring-accent/50" : "";

    const goToPost = () => router.push(href);
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToPost();
        }
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
        // TODO: Save to localStorage or API
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title || "",
                    url: window.location.origin + href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.origin + href);
                // Optional: Show a success message
            }
        } catch (error) {
            // User cancelled the share dialog or clipboard failed - this is normal behavior
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Share failed:', error);
            }
            // Silently ignore AbortError (user cancellation)
        }
    };

    const t = {
        read: labels?.read ?? "Read",
        featured: labels?.featured ?? "Featured",
        new: labels?.new ?? "New",
        trending: labels?.trending ?? "Trending",
        updated: labels?.updated ?? "Updated",
        views: labels?.views ?? "views",
    };

    const visibleTags = showAllTags ? post.tags : post.tags?.slice(0, maxTags);
    const isListView = viewMode === "list";

    return (
        <article
            role="link"
            tabIndex={0}
            aria-label={post.title}
            onClick={goToPost}
            onKeyDown={onKey}
            className={`group card card-hover overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex ${
                isListView ? "flex-row" : "flex-col"
            } ${ringCls}`}
        >
            {/* Image Section with Lazy Loading */}
            <div className={`relative ${isListView ? "w-1/3" : "aspect-[16/10] w-full"} overflow-hidden`}>
                {/* Lazy Loading Skeleton */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted animate-pulse" />
                )}

                <Image
                    src={imgSrc}
                    alt={post.title || "Post"}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={featured}
                    onLoad={() => setImageLoaded(true)}
                />

                {/* Status Badges */}
                <div className="absolute left-2 sm:left-4 top-2 sm:top-4 flex flex-col gap-2">
                    {featured && (
                        <div className="chip px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs bg-accent text-black font-semibold">
                            {t.featured}
                        </div>
                    )}
                    {post.isNew && <StatusBadge type="new" label={t.new} />}
                    {post.isTrending && <StatusBadge type="trending" label={t.trending} />}
                    {post.isUpdated && <StatusBadge type="updated" label={t.updated} />}
                </div>

                {/* Quick Actions on Hover */}
                <div className="absolute right-2 sm:right-4 top-2 sm:top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    {/* Bookmark Button */}
                    <button
                        onClick={handleBookmark}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center hover:bg-black/90 transition-all hover:scale-110"
                        aria-label="Bookmark"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={isBookmarked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-white"
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    </button>

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center hover:bg-black/90 transition-all hover:scale-110"
                        aria-label="Share"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-white"
                        >
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>

                    {/* More Actions */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowQuickActions(!showQuickActions);
                            }}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center hover:bg-black/90 transition-all hover:scale-110"
                            aria-label="More actions"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-white"
                            >
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showQuickActions && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-card/95 backdrop-blur-lg border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(window.location.origin + href);
                                        setShowQuickActions(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm hover:bg-accent/10 transition-colors flex items-center gap-3"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    <span>Copy link</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowQuickActions(false);
                                        alert("Report functionality coming soon!");
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm hover:bg-accent/10 transition-colors flex items-center gap-3 text-red-400"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>Report</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gradient Overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Content Section */}
            <div className={`${featured ? "p-4 sm:p-5 md:p-6" : "p-4 sm:p-5"} flex flex-col ${isListView ? "w-2/3" : ""}`}>
                {/* Title with Better Typography */}
                <h3
                    className={`font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-accent ${
                        featured ? "text-xl sm:text-2xl md:text-3xl" : "text-base sm:text-lg"
                    } ${infoCentered ? "text-center" : ""}`}
                >
                    {post.title}
                </h3>

                {/* Description with Truncation */}
                {post.description && (
                    <p
                        className={`text-dim mt-3 sm:mt-4 line-clamp-2 text-sm sm:text-base ${
                            infoCentered ? "text-center" : ""
                        }`}
                    >
                        {post.description}
                    </p>
                )}

                {/* Metadata Row with View Count */}
                <div
                    className={`mt-3 sm:mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-dim ${
                        infoCentered ? "justify-center" : ""
                    }`}
                >
                    {created && <span>{created}</span>}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        {meta}
                    </span>
                    {post.viewCount !== undefined && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                {post.viewCount.toLocaleString()} {t.views}
                            </span>
                        </>
                    )}
                </div>

                {/* Enhanced Tags with Icons and Show More */}
                {post.tags && post.tags.length > 0 && (
                    <div className={`mt-3 sm:mt-4 ${infoCentered ? "text-center" : ""}`}>
                        <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${infoCentered ? "justify-center" : ""}`}>
                            {visibleTags?.map((tag, i) => (
                                <button
                                    key={`${tag.slug ?? tag.name}-${i}`}
                                    type="button"
                                    className="group/tag inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 hover:border-accent hover:bg-accent/20 hover:scale-105 transition-all touch-manipulation"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/tags/${tag.slug ?? tag.name}`);
                                    }}
                                >
                                    <span className="text-[10px]">#</span>
                                    <span>{tag.name}</span>
                                </button>
                            ))}
                            {!showAllTags && post.tags.length > maxTags && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAllTags(true);
                                    }}
                                    className="text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors"
                                >
                                    +{post.tags.length - maxTags} more
                                </button>
                            )}
                            {showAllTags && post.tags.length > maxTags && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAllTags(false);
                                    }}
                                    className="text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors"
                                >
                                    Show less
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Read Button with Enhanced Styling */}
                <div className={`mt-4 sm:mt-5 ${infoCentered ? "text-center" : ""}`}>
                    <button
                        type="button"
                        aria-label="Read post"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPost();
                        }}
                        className="group/btn inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-black font-semibold h-9 px-5 sm:h-10 sm:px-6 text-sm sm:text-base shadow-[0_4px_16px_-4px_rgba(46,231,216,.5)] hover:shadow-[0_8px_24px_-6px_rgba(46,231,216,.65)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent/60 touch-manipulation transition-all duration-300"
                    >
                        <span>{t.read}</span>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="transition-transform group-hover/btn:translate-x-1"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
}
