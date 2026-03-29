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
                <div className="absolute z-[9999] mt-2 w-[240px] rounded-2xl border border-white/20 bg-black/95 backdrop-blur-sm p-3 shadow-xl left-0 md:left-auto">
                    <div className="text-sm text-white/70 px-1 pb-2">Apply color to selection</div>

                    <div className="grid grid-cols-8 gap-2 mb-2">
                        {PALETTE.map(c => (
                            <button
                                key={c}
                                type="button"
                                className="h-8 w-8 rounded-full border-2 border-white/30 hover:border-accent transition focus:outline-none focus:ring-2 focus:ring-accent hover:scale-110"
                                style={{ backgroundColor: c }}
                                onClick={() => { onPickAction(c); setOpen(false); }}
                                title={c}
                            />
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                        <label className="btn btn-soft px-3 py-2 text-sm cursor-pointer min-h-[44px] touch-manipulation">
                            🎨 Custom…
                            <input type="color" className="sr-only" onChange={onCustom} />
                        </label>
                        <button
                            type="button"
                            className="btn btn-ghost px-3 py-2 text-sm min-h-[44px] touch-manipulation"
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