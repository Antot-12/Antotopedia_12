"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";

type PostListItem = {
    id: number | string;
    slug: string;
    title: string;
    description: string | null;
    contentMarkdown?: string | null;
    coverImageUrl: string | null;
    createdAt?: string | Date | null;
    tags?: { name: string; slug?: string }[];
};

export default function RecentPosts({
                                        featured,
                                        posts,
                                        maxTagsFeatured = Infinity,
                                        maxTagsCard = 6,
                                        centerFeatured = true,
                                        locale,
                                        labels,
                                    }: {
    featured?: PostListItem;
    posts: PostListItem[];
    maxTagsFeatured?: number;
    maxTagsCard?: number;
    centerFeatured?: boolean;
    locale?: "en" | "uk";
    labels?: { read?: string; featured?: string };
}) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const ordered = featured
        ? [featured, ...posts.filter((p) => p.id !== featured.id)]
        : posts;

    // Load view mode from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("viewMode") as "grid" | "list" | null;
        if (saved) {
            setViewMode(saved);
        }
    }, []);

    // Listen for view mode changes
    useEffect(() => {
        const handleViewModeChange = (e: CustomEvent<"grid" | "list">) => {
            setViewMode(e.detail);
        };

        window.addEventListener("viewModeChange" as any, handleViewModeChange);
        return () => window.removeEventListener("viewModeChange" as any, handleViewModeChange);
    }, []);

    return (
        <section className="grid gap-6">
            <div className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start"
                : "grid gap-4"
            }>
                {ordered.map((p) => (
                    <PostCard
                        key={p.id}
                        post={p}
                        bordered
                        infoCentered={true}
                        maxTags={featured && p.id === featured.id ? maxTagsFeatured : maxTagsCard}
                        locale={locale}
                        labels={labels}
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </section>
    );
}
