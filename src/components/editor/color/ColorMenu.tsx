"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    onPickAction: (hex: string) => void;
    onClearAction: () => void;
    onBeforeColorOpenAction?: () => void;
};

const PALETTE = [
    "#10b981", "#22d3ee", "#60a5fa", "#f59e0b",
    "#f472b6", "#a78bfa", "#34d399", "#4ade80",
    "#f87171", "#fb923c", "#facc15", "#4caff0",
    "#7e22ce", "#a8a8a8", "#000000", "#ffffff",
    "#ef4444", "#f97316", "#eab308", "#84cc16",
    "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
    "#e11d48", "#dc2626", "#ea580c", "#ca8a04",
    "#65a30d", "#059669", "#0891b2", "#0284c7",
    "#2563eb", "#4f46e5", "#7c3aed", "#9333ea",
];

export default function ColorMenu({ onPickAction, onClearAction, onBeforeColorOpenAction }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    const toggle = () => {
        onBeforeColorOpenAction?.();
        setOpen(v => !v);
    };

    const onCustom: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const hex = e.target.value;
        onPickAction(hex);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                onClick={toggle}
                aria-expanded={open}
                aria-haspopup="true"
                title="Text Color"
            >
                <span className="text-base">🎨 Color</span>
            </button>

            {open && (
                <div
                    className="fixed mt-2 w-[300px] rounded-2xl border-2 border-accent bg-black backdrop-blur-sm p-4"
                    style={{
                        zIndex: 999999,
                        boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                        top: 'auto',
                        left: 'auto'
                    }}
                >
                    <div className="text-sm text-white font-semibold px-1 pb-3 border-b border-accent/30">
                        🎨 Pick a Color
                    </div>

                    <div className="grid grid-cols-8 gap-2.5 mt-3 mb-3">
                        {PALETTE.map(c => (
                            <button
                                key={c}
                                type="button"
                                className="h-9 w-9 rounded-lg border-2 border-white/40 hover:border-accent hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                                style={{ backgroundColor: c, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                                onClick={() => { onPickAction(c); setOpen(false); }}
                                title={c}
                            />
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                        <label className="btn btn-soft px-3 py-2 text-sm cursor-pointer min-h-[44px] touch-manipulation hover:bg-accent/20">
                            🎨 Custom…
                            <input type="color" className="sr-only" onChange={onCustom} />
                        </label>
                        <button
                            type="button"
                            className="btn btn-ghost px-3 py-2 text-sm min-h-[44px] touch-manipulation hover:text-red-400"
                            onClick={() => { onClearAction(); setOpen(false); }}
                        >
                            ✕ Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}