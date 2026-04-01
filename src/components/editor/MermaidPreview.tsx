"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    code: string;
    theme?: "default" | "dark" | "forest" | "neutral";
};

export default function MermaidPreview({ code, theme = "dark" }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string>("");
    const [isRendering, setIsRendering] = useState(false);

    useEffect(() => {
        let mounted = true;

        const renderDiagram = async () => {
            if (!code.trim() || !containerRef.current) return;

            setIsRendering(true);
            setError("");

            try {
                // Dynamically import mermaid to avoid SSR issues
                const mermaid = (await import("mermaid")).default;

                // Configure mermaid
                mermaid.initialize({
                    startOnLoad: false,
                    theme,
                    securityLevel: "loose",
                    fontFamily: "ui-monospace, monospace",
                });

                // Generate unique ID
                const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                // Render the diagram
                const { svg } = await mermaid.render(id, code);

                if (mounted && containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err?.message || "Failed to render diagram");
                }
            } finally {
                if (mounted) {
                    setIsRendering(false);
                }
            }
        };

        renderDiagram();

        return () => {
            mounted = false;
        };
    }, [code, theme]);

    if (error) {
        return (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <div className="flex items-start gap-2">
                    <span className="text-red-400">❌</span>
                    <div>
                        <div className="text-sm font-semibold text-red-400 mb-1">
                            Mermaid Diagram Error
                        </div>
                        <div className="text-xs text-red-300/80">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {isRendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <div
                ref={containerRef}
                className="mermaid-container rounded-lg p-4 bg-white/5 border border-white/10 overflow-auto"
                style={{ minHeight: "100px" }}
            />
        </div>
    );
}
