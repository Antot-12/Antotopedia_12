"use client";

import { useState } from "react";

type Props = { code: string; language?: string };

export default function CodeBlock({ code, language }: Props) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {}
    };

    return (
        <div className="relative group">
      <pre className="rounded-xl border border-white/10 bg-black/40 p-4 overflow-auto">
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>

            <div className="absolute right-2 top-2 flex items-center gap-2">
                {language ? (
                    <span className="text-xs text-white/70 bg-black/50 rounded px-2 py-0.5">
            {language}
          </span>
                ) : null}
                <button onClick={copy} className="text-xs btn btn-soft px-2 py-1">
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
        </div>
    );
}
