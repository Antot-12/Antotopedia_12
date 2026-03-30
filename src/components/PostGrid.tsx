"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";

type ListItem = {
    id: number | string;
    slug?: string | null;
    title?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    tags?: { name: string; slug?: string }[];
};

export default function PostGrid({ posts, locale, labels }: {
    posts: ListItem[];
    locale?: "en" | "uk";
    labels?: any;
}) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        <div className={viewMode === "grid"
            ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 items-stretch auto-rows-fr"
            : "grid gap-3 sm:gap-4"
        }>
            {posts.map((p) => (
                <PostCard
                    key={p.id}
                    post={p}
                    bordered
                    locale={locale}
                    labels={labels}
                    viewMode={viewMode}
                />
            ))}
        </div>
    );
}
