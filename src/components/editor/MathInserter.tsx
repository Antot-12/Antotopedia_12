"use client";

import { useState } from "react";

const EQUATION_EXAMPLES = {
    "Pythagorean Theorem": "a^2 + b^2 = c^2",
    "Quadratic Formula": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
    "Einstein's Mass-Energy": "E = mc^2",
    "Area of Circle": "A = \\pi r^2",
    "Binomial Theorem": "(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k",
    "Euler's Identity": "e^{i\\pi} + 1 = 0",
    "Derivative": "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}",
    "Integral": "\\int_{a}^{b} f(x) \\, dx",
    "Summation": "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
    "Matrix": "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
    "Limit": "\\lim_{x \\to \\infty} \\frac{1}{x} = 0",
    "Partial Derivative": "\\frac{\\partial f}{\\partial x}",
};

type Props = {
    onInsert: (latex: string, isInline: boolean) => void;
};

export default function MathInserter({ onInsert }: Props) {
    const [latex, setLatex] = useState("");
    const [isInline, setIsInline] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleInsert = () => {
        if (!latex.trim()) return;
        onInsert(latex, isInline);
        setLatex("");
    };

    const insertExample = (example: string) => {
        setLatex(example);
        setShowPreview(true);
    };

    return (
        <div className="card p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">➗ Insert Math Equation</h3>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs btn btn-soft"
                >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
            </div>

            {/* Inline vs Block */}
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        checked={isInline}
                        onChange={() => setIsInline(true)}
                        className="accent-accent"
                    />
                    <span className="text-sm">Inline ($ ... $)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        checked={!isInline}
                        onChange={() => setIsInline(false)}
                        className="accent-accent"
                    />
                    <span className="text-sm">Block ($$ ... $$)</span>
                </label>
            </div>

            {/* LaTeX Editor */}
            <div>
                <label className="text-sm text-white/70 mb-2 block">LaTeX Code:</label>
                <textarea
                    value={latex}
                    onChange={(e) => setLatex(e.target.value)}
                    className="input font-mono text-sm min-h-[120px] resize-y"
                    placeholder="Enter LaTeX equation... (e.g., x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a})"
                />
            </div>

            {/* Preview */}
            {showPreview && latex.trim() && (
                <div>
                    <label className="text-sm text-white/70 mb-2 block">Preview:</label>
                    <div className="card p-4 bg-white/5 border border-white/10">
                        <LatexPreview latex={latex} inline={isInline} />
                    </div>
                </div>
            )}

            {/* Common Equations */}
            <div>
                <label className="text-sm text-white/70 mb-2 block">Quick Insert:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                    {Object.entries(EQUATION_EXAMPLES).map(([name, equation]) => (
                        <button
                            key={name}
                            onClick={() => insertExample(equation)}
                            className="text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 transition text-left"
                            title={equation}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
                <button
                    onClick={handleInsert}
                    disabled={!latex.trim()}
                    className="btn btn-primary disabled:opacity-50"
                >
                    ✓ Insert Equation
                </button>
            </div>

            {/* Help */}
            <div className="text-xs text-white/60 space-y-1">
                <p>
                    <strong>Inline:</strong> Use <code className="text-accent">$...$</code> for inline equations
                </p>
                <p>
                    <strong>Block:</strong> Use <code className="text-accent">$$...$$</code> for centered block
                    equations
                </p>
                <p>
                    Learn more:{" "}
                    <a
                        href="https://katex.org/docs/supported.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                    >
                        KaTeX Functions
                    </a>
                </p>
            </div>
        </div>
    );
}

// Client-side LaTeX preview component
function LatexPreview({ latex, inline }: { latex: string; inline: boolean }) {
    const [rendered, setRendered] = useState<string>("");
    const [error, setError] = useState<string>("");

    useState(() => {
        const renderLatex = async () => {
            try {
                const katex = (await import("katex")).default;
                const html = katex.renderToString(latex, {
                    displayMode: !inline,
                    throwOnError: false,
                    errorColor: "#ff6b6b",
                });
                setRendered(html);
                setError("");
            } catch (err: any) {
                setError(err.message || "Rendering error");
            }
        };
        renderLatex();
    });

    if (error) {
        return (
            <div className="text-red-400 text-sm">
                ❌ {error}
            </div>
        );
    }

    return <div dangerouslySetInnerHTML={{ __html: rendered }} />;
}
