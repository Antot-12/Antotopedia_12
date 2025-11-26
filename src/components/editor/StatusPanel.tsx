"use client";

import { useCallback } from "react";

function SpinnerWithText({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center gap-2">
            <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                />
                <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4A4 4 0 0 0 8 12H4z"
                />
            </svg>
            <span>{text}</span>
        </span>
    );
}

type Props = {
    status: "draft" | "published";
    busy: boolean;
    canDelete: boolean;
    error: string | null;
    onChangeStatusAction: (s: "draft" | "published") => void;
    onSaveDraftAction: () => void;
    onPublishAction: () => void;
    onDeleteAction: () => void;
};

export default function StatusPanel({
                                        status,
                                        busy,
                                        canDelete,
                                        error,
                                        onChangeStatusAction,
                                        onSaveDraftAction,
                                        onPublishAction,
                                        onDeleteAction,
                                    }: Props) {
    const publishLabel = status === "published" ? "Update" : "Publish";

    const onSegmentKey = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            if (e.key === "ArrowLeft") onChangeStatusAction("draft");
            if (e.key === "ArrowRight") onChangeStatusAction("published");
        },
        [onChangeStatusAction]
    );

    return (
        <section className="card p-2 grid gap-1" aria-busy={busy}>

            <div className="grid gap-1">
                <div className="text-sm font-medium px-1">Status</div>
                <div
                    role="radiogroup"
                    aria-label="Post status"
                    tabIndex={0}
                    onKeyDown={onSegmentKey}
                    className="w-full rounded-xl bg-black/40 p-1"
                >
                    <div className="grid grid-cols-2">
                        <button
                            type="button"
                            role="radio"
                            aria-checked={status === "draft"}
                            onClick={() => onChangeStatusAction("draft")}
                            disabled={busy}
                            className={`h-9 rounded-lg text-sm font-medium transition outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-0 ${
                                status === "draft"
                                    ? "bg-accent/10 text-accent shadow-lg"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                            title="Keep as a draft"
                        >
                            Draft
                        </button>
                        <button
                            type="button"
                            role="radio"
                            aria-checked={status === "published"}
                            onClick={() => onChangeStatusAction("published")}
                            disabled={busy}
                            className={`h-9 rounded-lg text-sm font-medium transition outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-0 ${
                                status === "published"
                                    ? "bg-accent/10 text-accent shadow-lg"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                            title="Make it visible"
                        >
                            Published
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/10 pt-2">

                {/* ЗМІНЕНО: flex justify-center для центрування кнопок Save/Publish */}
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        className="btn btn-primary h-10 px-4 disabled:cursor-not-allowed text-sm font-medium"
                        disabled={busy}
                        onClick={onSaveDraftAction}
                        title="Save current changes (Ctrl/⌘ + S)"
                    >
                        {busy ? <SpinnerWithText text="Saving…" /> : "Save"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-soft h-10 px-4 disabled:cursor-not-allowed text-sm font-medium"
                        disabled={busy}
                        onClick={onPublishAction}
                        title={publishLabel}
                    >
                        {publishLabel}
                    </button>
                </div>

                <button
                    type="button"
                    className="btn btn-ghost w-full h-9 px-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 disabled:text-white/40 disabled:cursor-not-allowed"
                    disabled={busy || !canDelete}
                    onClick={onDeleteAction}
                    title="Permanently delete the post"
                >
                    Delete Post
                </button>
            </div>

            {!!error && (
                <div className="text-red-400 text-sm pt-1" role="alert" aria-live="polite">
                    {error}
                </div>
            )}
        </section>
    );
}