"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
    const [p, setP] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const top = h.scrollTop || document.body.scrollTop;
            const height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
            const val = height > 0 ? Math.min(100, Math.max(0, (top / height) * 100)) : 0;
            setP(val);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-white/5">
            <div className="h-full bg-accent transition-[width]" style={{ width: `${p}%` }} />
        </div>
    );
}
