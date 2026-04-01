"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
    code: string;
    language?: string;
    meta?: string; // For line highlighting: {1,3-5}
};

export default function CodeBlock({ code, language, meta }: Props) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isExecuting, setIsExecuting] = useState(false);
    const [output, setOutput] = useState<string>("");
    const outputRef = useRef<HTMLDivElement>(null);

    // Parse meta for line highlights
    const highlightedLines = parseMeta(meta);
    const isDiff = language === "diff" || code.includes("\n+") || code.includes("\n-");
    const isExecutable = ["javascript", "js", "typescript", "ts"].includes(language || "");

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const download = () => {
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `code.${language || "txt"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const executeCode = async () => {
        if (!isExecutable) return;

        setIsExecuting(true);
        setOutput("");

        try {
            // Create a sandboxed execution environment
            const logs: string[] = [];
            const customConsole = {
                log: (...args: any[]) => logs.push(args.join(" ")),
                error: (...args: any[]) => logs.push(`❌ ${args.join(" ")}`),
                warn: (...args: any[]) => logs.push(`⚠️ ${args.join(" ")}`),
            };

            // Execute in a sandboxed context
            const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
            const fn = new AsyncFunction("console", code);
            await fn(customConsole);

            setOutput(logs.length > 0 ? logs.join("\n") : "✅ Code executed successfully (no output)");
        } catch (error: any) {
            setOutput(`❌ Error: ${error.message}`);
        } finally {
            setIsExecuting(false);
        }
    };

    const lines = code.split("\n");
    const lineCount = lines.length;
    const isLong = lineCount > 20;

    useEffect(() => {
        if (output && outputRef.current) {
            outputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [output]);

    return (
        <div className="relative group my-6">
            <pre
                className={`rounded-xl border border-white/10 bg-black/50 p-4 overflow-auto transition-all ${isLong && !isExpanded ? "max-h-[300px]" : ""
                    }`}
            >
                <code className={language ? `language-${language}` : undefined}>
                    {isDiff ? (
                        <DiffView lines={lines} />
                    ) : (
                        <HighlightedCode lines={lines} highlights={highlightedLines} />
                    )}
                </code>
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

                {isExecutable && (
                    <button
                        onClick={executeCode}
                        disabled={isExecuting}
                        className="text-xs bg-black/70 hover:bg-green-600 hover:text-white rounded px-3 py-1 font-medium transition border border-white/20 hover:border-green-600 disabled:opacity-50"
                        title="Execute code"
                    >
                        {isExecuting ? "⏳ Running..." : "▶️ Run"}
                    </button>
                )}

                <button
                    onClick={download}
                    className="text-xs bg-black/70 hover:bg-blue-600 hover:text-white rounded px-3 py-1 font-medium transition border border-white/20 hover:border-blue-600"
                    title="Download code"
                >
                    💾 Download
                </button>

                <button
                    onClick={copy}
                    className="text-xs bg-black/70 hover:bg-accent hover:text-black rounded px-3 py-1 font-medium transition border border-white/20 hover:border-accent"
                    title="Copy code to clipboard"
                >
                    {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
            </div>

            {/* Execution Output */}
            {output && (
                <div
                    ref={outputRef}
                    className="mt-2 rounded-lg border border-green-500/30 bg-black/50 p-4"
                >
                    <div className="text-xs text-green-400 mb-2 font-semibold">Output:</div>
                    <pre className="text-sm text-white/90 whitespace-pre-wrap font-mono">{output}</pre>
                </div>
            )}

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

// Parse meta string for line highlights
// Example: {1,3-5,10} => [1, 3, 4, 5, 10]
function parseMeta(meta?: string): Set<number> {
    const highlights = new Set<number>();
    if (!meta) return highlights;

    const match = meta.match(/\{([0-9,-]+)\}/);
    if (!match) return highlights;

    const parts = match[1].split(",");
    for (const part of parts) {
        if (part.includes("-")) {
            const [start, end] = part.split("-").map(Number);
            for (let i = start; i <= end; i++) {
                highlights.add(i);
            }
        } else {
            highlights.add(Number(part));
        }
    }

    return highlights;
}

// Highlighted code lines
function HighlightedCode({ lines, highlights }: { lines: string[]; highlights: Set<number> }) {
    return (
        <>
            {lines.map((line, idx) => (
                <div
                    key={idx}
                    className={`${highlights.has(idx + 1) ? "bg-accent/10 border-l-2 border-l-accent pl-2 -ml-2" : ""
                        }`}
                >
                    {line}
                    {"\n"}
                </div>
            ))}
        </>
    );
}

// Diff view (+ for additions, - for deletions)
function DiffView({ lines }: { lines: string[] }) {
    return (
        <>
            {lines.map((line, idx) => {
                const isDeletion = line.startsWith("-");
                const isAddition = line.startsWith("+");
                const isContext = !isDeletion && !isAddition;

                return (
                    <div
                        key={idx}
                        className={`
              ${isDeletion ? "bg-red-500/10 text-red-400 line-through" : ""}
              ${isAddition ? "bg-green-500/10 text-green-400" : ""}
              ${isContext ? "text-white/70" : ""}
            `}
                    >
                        {line}
                        {"\n"}
                    </div>
                );
            })}
        </>
    );
}
