"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  estimatedTime?: string;
};

export default function EnhancedShareBar({ url, title, estimatedTime }: Props) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  const shareButtons = [
    {
      name: "Twitter",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-black/60",
    },
    {
      name: "Facebook",
      icon: "f",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-600/60",
    },
    {
      name: "LinkedIn",
      icon: "in",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-700/60",
    },
    {
      name: "Reddit",
      icon: "⬆",
      url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: "hover:bg-orange-600/60",
    },
  ];

  const printPage = () => {
    window.print();
  };

  return (
    <div className="card p-4 sticky top-24">
      <h3 className="text-sm font-semibold mb-3 text-white/90">Share Article</h3>

      {/* Reading Time */}
      {estimatedTime && (
        <div className="mb-4 p-2 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-accent">⏱️</span>
            <span className="text-white/70">{estimatedTime}</span>
          </div>
        </div>
      )}

      {/* Share Buttons */}
      <div className="grid gap-2 mb-3">
        {shareButtons.map((btn) => (
          <a
            key={btn.name}
            href={btn.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-white/10 bg-white/5 ${btn.color} transition text-sm`}
            onMouseEnter={() => setShowTooltip(btn.name)}
            onMouseLeave={() => setShowTooltip(null)}
            title={`Share on ${btn.name}`}
          >
            <span className="text-lg font-bold w-6 text-center">{btn.icon}</span>
            <span className="text-white/80">{btn.name}</span>
          </a>
        ))}
      </div>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-accent/20 hover:border-accent transition text-sm"
        title="Copy link to clipboard"
      >
        <span className="text-lg">{copied ? "✓" : "🔗"}</span>
        <span className="text-white/80">{copied ? "Copied!" : "Copy Link"}</span>
      </button>

      {/* Print Button */}
      <button
        onClick={printPage}
        className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
        title="Print article"
      >
        <span className="text-lg">🖨️</span>
        <span className="text-white/80">Print</span>
      </button>

      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-[10px] text-white/50 uppercase tracking-wide mb-2">Quick Actions</p>
        <div className="flex gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex-1 px-2 py-1.5 text-xs rounded bg-white/5 hover:bg-white/10 transition border border-white/10"
            title="Scroll to top"
          >
            ⬆️ Top
          </button>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            className="flex-1 px-2 py-1.5 text-xs rounded bg-white/5 hover:bg-white/10 transition border border-white/10"
            title="Scroll to bottom"
          >
            ⬇️ Bottom
          </button>
        </div>
      </div>
    </div>
  );
}
