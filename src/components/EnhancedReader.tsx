"use client";

import { useState, useEffect } from "react";
import { Markdown } from "@/lib/markdown";

type ReadingMode = "comfortable" | "wide" | "focus";
type FontSize = "small" | "medium" | "large" | "xlarge";

type Props = {
  content: string;
  theme?: string;
};

export default function EnhancedReader({ content, theme = "default" }: Props) {
  const [readingMode, setReadingMode] = useState<ReadingMode>("comfortable");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [showControls, setShowControls] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load saved preferences
    const savedMode = localStorage.getItem("readingMode") as ReadingMode;
    const savedSize = localStorage.getItem("fontSize") as FontSize;
    if (savedMode) setReadingMode(savedMode);
    if (savedSize) setFontSize(savedSize);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("readingMode", readingMode);
      localStorage.setItem("fontSize", fontSize);
    }
  }, [readingMode, fontSize, isClient]);

  const modeStyles = {
    comfortable: "max-w-3xl",
    wide: "max-w-5xl",
    focus: "max-w-2xl",
  };

  const fontSizeStyles = {
    small: "text-[0.9375rem]",
    medium: "text-base",
    large: "text-lg",
    xlarge: "text-xl",
  };

  const containerClass = `mx-auto transition-all duration-300 ${modeStyles[readingMode]}`;
  const contentClass = `prose prose-invert max-w-none ${fontSizeStyles[fontSize]} reading-mode-${readingMode} theme-${theme}`;

  return (
    <div className="relative">
      {/* Reading Controls */}
      {showControls && (
        <div className="sticky top-20 z-40 mb-6">
          <div className="card p-3 bg-black/90 backdrop-blur-sm border-white/20">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Reading Mode */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-dim">Mode:</span>
                <div className="flex gap-1 bg-black/40 rounded-lg p-1">
                  <button
                    onClick={() => setReadingMode("comfortable")}
                    className={`px-3 py-1 rounded text-xs transition ${
                      readingMode === "comfortable"
                        ? "bg-accent text-black font-medium"
                        : "text-white/70 hover:text-accent"
                    }`}
                    title="Comfortable - Balanced width"
                  >
                    📖 Comfortable
                  </button>
                  <button
                    onClick={() => setReadingMode("wide")}
                    className={`px-3 py-1 rounded text-xs transition ${
                      readingMode === "wide"
                        ? "bg-accent text-black font-medium"
                        : "text-white/70 hover:text-accent"
                    }`}
                    title="Wide - Full width"
                  >
                    ↔️ Wide
                  </button>
                  <button
                    onClick={() => setReadingMode("focus")}
                    className={`px-3 py-1 rounded text-xs transition ${
                      readingMode === "focus"
                        ? "bg-accent text-black font-medium"
                        : "text-white/70 hover:text-accent"
                    }`}
                    title="Focus - Narrow, distraction-free"
                  >
                    🎯 Focus
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-dim">Size:</span>
                <div className="flex gap-1 bg-black/40 rounded-lg p-1">
                  <button
                    onClick={() => setFontSize("small")}
                    className={`px-3 py-1 rounded text-xs transition ${
                      fontSize === "small"
                        ? "bg-accent text-black font-medium"
                        : "text-white/70 hover:text-accent"
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("medium")}
                    className={`px-3 py-1 rounded text-sm transition ${
                      fontSize === "medium"
                        ? "bg-accent text-black font-medium"
                        : "text-white/70 hover:text-accent"
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("large")}
                    className={`px-3 py-1 rounded text-base transition ${
                      fontSize === "large"
                        ? "bg-accent text-black font-medium"
                        : "text-white/70 hover:text-accent"
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("xlarge")}
                    className={`px-3 py-1 rounded text-lg transition ${
                      fontSize === "xlarge"
                        ? "bg-accent text-black font-medium"
                        : "text-white/70 hover:text-accent"
                    }`}
                  >
                    A
                  </button>
                </div>
              </div>

              {/* Hide Controls */}
              <button
                onClick={() => setShowControls(false)}
                className="text-xs text-white/50 hover:text-accent transition"
                title="Hide controls (press 'R' to show)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="sticky top-20 z-40 mb-6 btn btn-soft text-xs"
          title="Show reading controls"
        >
          ⚙️ Reading Options
        </button>
      )}

      {/* Content */}
      <div className={containerClass}>
        <div className={contentClass}>
          <Markdown value={content} />
        </div>
      </div>

      {/* Keyboard shortcut handler */}
      <KeyboardShortcuts
        onToggleControls={() => setShowControls(!showControls)}
        onCycleFontSize={() => {
          const sizes: FontSize[] = ["small", "medium", "large", "xlarge"];
          const currentIndex = sizes.indexOf(fontSize);
          const nextIndex = (currentIndex + 1) % sizes.length;
          setFontSize(sizes[nextIndex]);
        }}
        onCycleMode={() => {
          const modes: ReadingMode[] = ["comfortable", "wide", "focus"];
          const currentIndex = modes.indexOf(readingMode);
          const nextIndex = (currentIndex + 1) % modes.length;
          setReadingMode(modes[nextIndex]);
        }}
      />
    </div>
  );
}

// Keyboard shortcuts component
function KeyboardShortcuts({
  onToggleControls,
  onCycleFontSize,
  onCycleMode,
}: {
  onToggleControls: () => void;
  onCycleFontSize: () => void;
  onCycleMode: () => void;
}) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        onToggleControls();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        onCycleFontSize();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        onCycleMode();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onToggleControls, onCycleFontSize, onCycleMode]);

  return null;
}
