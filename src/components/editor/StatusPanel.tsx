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

// Status Icons
function DraftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function PublishedIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

type Props = {
    status: "draft" | "published";
    busy: boolean;
    canDelete: boolean;
    error: string | null;
    saveStatus?: "saved" | "unsaved" | "saving";
    onChangeStatusAction: (s: "draft" | "published") => void;
    onSaveDraftAction: () => void;
    onPublishAction: () => void;
    onDeleteAction: () => void;
    labels?: {
        statusLabel?: string;
        draft?: string;
        published?: string;
        save?: string;
        saving?: string;
        update?: string;
        publish?: string;
        deletePost?: string;
        saveAndPublish?: string;
        allChangesSaved?: string;
        unsavedChanges?: string;
    };
};

export default function StatusPanel({
                                        status,
                                        busy,
                                        canDelete,
                                        error,
                                        saveStatus = "saved",
                                        onChangeStatusAction,
                                        onSaveDraftAction,
                                        onPublishAction,
                                        onDeleteAction,
                                        labels,
                                    }: Props) {
    const publishLabel = status === "published" ? (labels?.update || "Update") : (labels?.publish || "Publish");

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

            {/* Auto-save Indicator */}
            {saveStatus !== "saved" && (
                <div className="flex items-center justify-center gap-2 text-xs py-1.5 px-2 rounded-lg bg-black/30">
                    {saveStatus === "saving" && (
                        <>
                            <svg
                                className="animate-spin h-3 w-3"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
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
                            <span className="text-white/60">{labels?.saving || "Saving…"}</span>
                        </>
                    )}
                    {saveStatus === "unsaved" && (
                        <>
                            <span className="text-yellow-400">●</span>
                            <span className="text-yellow-400/80">{labels?.unsavedChanges || "Unsaved changes"}</span>
                        </>
                    )}
                </div>
            )}
            {saveStatus === "saved" && (
                <div className="flex items-center justify-center gap-2 text-xs py-1.5 px-2 rounded-lg bg-green-500/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-green-400/80">{labels?.allChangesSaved || "All changes saved"}</span>
                </div>
            )}

            <div className="grid gap-1">
                <div className="text-sm font-medium px-1 flex items-center gap-2">
                    <span>{labels?.statusLabel || "Status"}</span>
                    {status === "draft" && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">📝</span>}
                    {status === "published" && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">✅</span>}
                </div>
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
                            className={`h-9 rounded-lg text-sm font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-0 flex items-center justify-center gap-1.5 ${
                                status === "draft"
                                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-lg shadow-yellow-500/10 border border-yellow-500/30"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                            title="Keep as a draft"
                        >
                            <DraftIcon />
                            {labels?.draft || "Draft"}
                        </button>
                        <button
                            type="button"
                            role="radio"
                            aria-checked={status === "published"}
                            onClick={() => onChangeStatusAction("published")}
                            disabled={busy}
                            className={`h-9 rounded-lg text-sm font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-0 flex items-center justify-center gap-1.5 ${
                                status === "published"
                                    ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 shadow-lg shadow-green-500/10 border border-green-500/30"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                            title="Make it visible"
                        >
                            <PublishedIcon />
                            {labels?.published || "Published"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/10 pt-2">

                {/* Save & Publish buttons */}
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        className="btn btn-primary h-10 px-4 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                        disabled={busy}
                        onClick={onSaveDraftAction}
                        title="Save current changes (Ctrl/⌘ + S)"
                    >
                        {busy ? <SpinnerWithText text={labels?.saving || "Saving…"} /> : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                {labels?.save || "Save"}
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="btn btn-soft h-10 px-4 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                        disabled={busy}
                        onClick={onPublishAction}
                        title={publishLabel}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        {publishLabel}
                    </button>
                </div>

                {/* Save & Publish combo button */}
                {status === "draft" && (
                    <button
                        type="button"
                        className="btn h-9 px-3 text-xs font-medium bg-gradient-to-r from-accent/10 to-accent/5 border-accent/40 hover:border-accent text-accent disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        disabled={busy}
                        onClick={() => {
                            onSaveDraftAction();
                            setTimeout(() => {
                                onChangeStatusAction("published");
                                onPublishAction();
                            }, 100);
                        }}
                        title="Save and publish in one click"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        {labels?.saveAndPublish || "Save & Publish"}
                    </button>
                )}

                <button
                    type="button"
                    className="btn btn-ghost w-full h-9 px-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 disabled:text-white/40 disabled:cursor-not-allowed transition-all"
                    disabled={busy || !canDelete}
                    onClick={onDeleteAction}
                    title="Permanently delete the post"
                >
                    {labels?.deletePost || "Delete Post"}
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