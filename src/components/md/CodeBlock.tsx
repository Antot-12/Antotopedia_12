"use client";

import { useState } from "react";

type Props = { code: string; language?: string };

export default function CodeBlock({ code, language }: Props) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const lineCount = code.split("\n").length;
    const isLong = lineCount > 20;

    return (
        <div className="relative group my-6">
      <pre className={`rounded-xl border border-white/10 bg-black/50 p-4 overflow-auto transition-all ${
          isLong && !isExpanded ? "max-h-[300px]" : ""
      }`}>
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>

            {/* Toolbar */}
            <div className="absolute right-2 top-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {language && (
                    <span className="text-[10px] uppercase tracking-wide text-accent bg-black/70 rounded px-2 py-1 font-semibold border border-accent/30">
            {language}
          </span>
                )}
                <span className="text-[10px] text-white/50 bg-black/70 rounded px-2 py-1">
          {lineCount} {lineCount === 1 ? "line" : "lines"}
        </span>
                <button
                    onClick={copy}
                    className="text-xs bg-black/70 hover:bg-accent hover:text-black rounded px-3 py-1 font-medium transition border border-white/20 hover:border-accent"
                    title="Copy code to clipboard"
                >
                    {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
            </div>

            {/* Expand/Collapse for long code */}
            {isLong && (
                <div className="absolute bottom-0 left-0 right-0">
                    {!isExpanded && (
                        <div className="absolute inset-x-0 bottom-12 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full py-2 bg-black/90 hover:bg-black text-white/70 hover:text-accent text-xs font-medium transition border-t border-white/10"
                    >
                        {isExpanded ? "▲ Show Less" : "▼ Show More"}
                    </button>
                </div>
            )}
        </div>
    );
}
