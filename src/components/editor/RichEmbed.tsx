"use client";

import { useState } from "react";

const EMBED_PROVIDERS = {
  youtube: {
    name: "YouTube",
    icon: "▶️",
    regex: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    template: (id: string) =>
      `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
  },
  twitter: {
    name: "Twitter/X",
    icon: "𝕏",
    regex: /twitter\.com\/\w+\/status\/(\d+)|x\.com\/\w+\/status\/(\d+)/,
    template: (id: string) =>
      `<blockquote class="twitter-tweet"><a href="https://twitter.com/x/status/${id}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js"></script>`,
  },
  codepen: {
    name: "CodePen",
    icon: "💻",
    regex: /codepen\.io\/([^\/]+)\/pen\/([a-zA-Z0-9]+)/,
    template: (match: string) => {
      const parts = match.split("/");
      const user = parts[0];
      const penId = parts[1];
      return `<iframe height="500" style="width: 100%;" scrolling="no" title="${user}/${penId}" src="https://codepen.io/${user}/embed/${penId}?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`;
    },
  },
  vimeo: {
    name: "Vimeo",
    icon: "🎬",
    regex: /vimeo\.com\/(\d+)/,
    template: (id: string) =>
      `<div class="embed-container"><iframe src="https://player.vimeo.com/video/${id}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`,
  },
  spotify: {
    name: "Spotify",
    icon: "🎵",
    regex: /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    template: (match: string) => {
      const parts = match.split("/");
      const type = parts[0];
      const id = parts[1];
      return `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/${type}/${id}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    },
  },
  github: {
    name: "GitHub Gist",
    icon: "🐙",
    regex: /gist\.github\.com\/\w+\/([a-zA-Z0-9]+)/,
    template: (id: string) =>
      `<script src="https://gist.github.com/${id}.js"></script>`,
  },
};

type Props = {
  onInsert: (embed: string) => void;
  onClose: () => void;
};

export default function RichEmbed({ onInsert, onClose }: Props) {
  const [url, setUrl] = useState("");
  const [detected, setDetected] = useState<string | null>(null);

  const detectProvider = (inputUrl: string) => {
    for (const [key, provider] of Object.entries(EMBED_PROVIDERS)) {
      const match = inputUrl.match(provider.regex);
      if (match) {
        setDetected(key);
        return;
      }
    }
    setDetected(null);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    detectProvider(value);
  };

  const generateEmbed = () => {
    if (!detected) return null;

    const provider = EMBED_PROVIDERS[detected as keyof typeof EMBED_PROVIDERS];
    const match = url.match(provider.regex);

    if (!match) return null;

    const id = match[1] || match[2];
    if (detected === "codepen") {
      return provider.template(match[1] + "/" + match[2]);
    }
    if (detected === "spotify") {
      return provider.template(match[1] + "/" + match[2]);
    }

    return provider.template(id);
  };

  const handleInsert = () => {
    const embed = generateEmbed();
    if (embed) {
      onInsert("\n\n" + embed + "\n\n");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="card bg-black/95 border-white/20 p-6 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Embed Content</h3>
            <p className="text-xs text-white/60">Paste a URL to embed rich content</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label className="text-xs text-white/70 mb-1 block">Content URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="input"
            autoFocus
          />
          {detected && (
            <div className="text-xs text-accent mt-1 flex items-center gap-2">
              {EMBED_PROVIDERS[detected as keyof typeof EMBED_PROVIDERS].icon}
              <span>
                Detected: {EMBED_PROVIDERS[detected as keyof typeof EMBED_PROVIDERS].name}
              </span>
            </div>
          )}
        </div>

        {/* Supported Providers */}
        <div className="mb-4">
          <div className="text-xs text-white/60 mb-2">Supported platforms:</div>
          <div className="flex flex-wrap gap-2">
            {Object.values(EMBED_PROVIDERS).map((provider) => (
              <div
                key={provider.name}
                className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5"
              >
                <span>{provider.icon}</span>
                <span>{provider.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {detected && (
          <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-white/60 mb-2">Preview:</div>
            <div className="text-sm text-white/80 font-mono break-all">
              {generateEmbed()?.substring(0, 150)}...
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleInsert}
            disabled={!detected}
            className="btn btn-primary flex-1"
          >
            Insert Embed
          </button>
          <button onClick={onClose} className="btn btn-soft">
            Cancel
          </button>
        </div>

        {/* Examples */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-[10px] text-white/40">
            <strong>Examples:</strong>
            <div className="mt-1 space-y-0.5">
              <div>YouTube: https://youtube.com/watch?v=dQw4w9WgXcQ</div>
              <div>Twitter: https://twitter.com/user/status/123456</div>
              <div>CodePen: https://codepen.io/user/pen/abcdef</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
