"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export default function StickyWrapper({ children }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const rect = container.getBoundingClientRect();
            const navHeight = 96; // top-24 = 6rem = 96px

            // Check if we should stick
            if (rect.top <= navHeight) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={containerRef} className="hidden lg:block">
            <div
                className={`transition-all duration-200 ${
                    isSticky ? "fixed top-24 w-[380px]" : "relative"
                }`}
            >
                {children}
            </div>
        </div>
    );
}
