"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
    id: number | null;
    slug: string;
    status: "draft" | "published";
    createdAt: Date | undefined;
    contentMarkdown?: string;
    labels?: {
        postInfo?: string;
        id?: string;
        new?: string;
        status?: string;
        created?: string;
        viewPost?: string;
        draft?: string;
        published?: string;
        wordCount?: string;
        readingTime?: string;
        copyUrl?: string;
        copied?: string;
    };
};

// Calculate word count
function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

// Calculate reading time (200 words per minute)
function calculateReadingTime(wordCount: number): string {
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min`;
}

export default function PostMetadata({ id, slug, status, createdAt, contentMarkdown = "", labels }: Props) {
    const [copied, setCopied] = useState(false);

    const formatDate = (date: Date | undefined) => {
        if (!date) return '—';
        return new Date(date).toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const wordCount = countWords(contentMarkdown);
    const readingTime = calculateReadingTime(wordCount);

    const copyUrl = async () => {
        if (!id || status !== "published") return;
        const url = `${window.location.origin}/blog/${slug}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <section className="card p-3 text-sm">
            <div className="font-medium mb-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                {labels?.postInfo || "Post Info"}
            </div>
            <ul className="grid gap-2 text-dim">
                <li className="flex items-center gap-2">
                    <span className="text-white/40">🆔</span>
                    <span className="font-semibold text-white/80 w-16">{labels?.id || "ID"}:</span>
                    <span className="text-accent font-mono">{id ?? (labels?.new || "New")}</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-white/40">
                        {status === "draft" ? "📝" : "✅"}
                    </span>
                    <span className="font-semibold text-white/80 w-16">{labels?.status || "Status"}:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                        status === "draft"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}>
                        {status === "draft" ? (labels?.draft || "Draft") : (labels?.published || "Published")}
                    </span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-white/40">📅</span>
                    <span className="font-semibold text-white/80 w-16">{labels?.created || "Created"}:</span>
                    <span className="text-xs">{formatDate(createdAt)}</span>
                </li>

                {/* Separator */}
                <li className="border-t border-white/10 my-1" />

                {/* Word Count */}
                <li className="flex items-center gap-2">
                    <span className="text-white/40">📊</span>
                    <span className="font-semibold text-white/80 w-16">{labels?.wordCount || "Words"}:</span>
                    <span className="text-accent font-mono">{wordCount.toLocaleString()}</span>
                </li>

                {/* Reading Time */}
                <li className="flex items-center gap-2">
                    <span className="text-white/40">⏱️</span>
                    <span className="font-semibold text-white/80 w-16">{labels?.readingTime || "Read"}:</span>
                    <span>{readingTime}</span>
                </li>
            </ul>

            {id && status === "published" && (
                <div className="border-t border-white/10 pt-3 mt-3 grid gap-2">
                    <Link
                        href={`/blog/${slug}`}
                        target="_blank"
                        className="btn btn-soft w-full h-9 text-sm px-2 flex justify-center items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        {labels?.viewPost || "View Post"}
                    </Link>
                    <button
                        onClick={copyUrl}
                        className="btn btn-ghost w-full h-8 text-xs px-2 flex justify-center items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                    >
                        {copied ? (
                            <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {labels?.copied || "Copied!"}
                            </>
                        ) : (
                            <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                {labels?.copyUrl || "Copy URL"}
                            </>
                        )}
                    </button>
                </div>
            )}
        </section>
    );
}