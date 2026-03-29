"use client";

import { useState } from "react";

type Props = {
  onConvertToBullets?: () => void;
  onConvertToNumbers?: () => void;
  onConvertToTasks?: () => void;
  onIndent?: () => void;
  onOutdent?: () => void;
  onInsertCallout?: (type: string) => void;
  onInsertDivider?: (style: string) => void;
  onInsertLayout?: (layout: string) => void;
  onInsertBlogTemplate?: (template: string) => void;
  onInsertMath?: (type: "inline" | "block") => void;
};

export default function AdvancedToolbar(props: Props) {
  const [showLists, setShowLists] = useState(false);
  const [showCallouts, setShowCallouts] = useState(false);
  const [showLayouts, setShowLayouts] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const calloutTypes = [
    { name: "Info", icon: "ℹ️", color: "blue", style: "info" },
    { name: "Warning", icon: "⚠️", color: "orange", style: "warning" },
    { name: "Success", icon: "✅", color: "green", style: "success" },
    { name: "Danger", icon: "🚫", color: "red", style: "danger" },
    { name: "Tip", icon: "💡", color: "yellow", style: "tip" },
    { name: "Note", icon: "📝", color: "purple", style: "note" },
  ];

  const dividerStyles = [
    { name: "Simple", style: "simple" },
    { name: "Gradient", style: "gradient" },
    { name: "Dotted", style: "dotted" },
    { name: "Stars", style: "stars" },
  ];

  const layouts = [
    { name: "Two Columns", icon: "⫿", layout: "two-col" },
    { name: "Three Columns", icon: "⸬", layout: "three-col" },
    { name: "Sidebar Left", icon: "◧", layout: "sidebar-left" },
    { name: "Sidebar Right", icon: "◨", layout: "sidebar-right" },
  ];

  const blogTemplates = [
    { name: "Tutorial Steps", icon: "📋", template: "tutorial" },
    { name: "Comparison Table", icon: "⚖️", template: "comparison" },
    { name: "Image Gallery", icon: "🖼️", template: "gallery" },
    { name: "FAQ Section", icon: "❓", template: "faq" },
    { name: "Author Bio", icon: "👤", template: "author" },
    { name: "Timeline", icon: "⏳", template: "timeline" },
  ];

  return (
    <div className="card p-2 mt-2 overflow-x-auto">
      <div className="flex items-center gap-2 text-xs text-white/70 mb-2 uppercase tracking-wide">
        ⭐ Advanced Formatting
      </div>

      <div className="toolbar flex flex-wrap gap-1 min-w-max md:min-w-0">
        {/* List Tools */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
            onClick={() => {
              setShowLists(!showLists);
              setShowCallouts(false);
              setShowLayouts(false);
              setShowTemplates(false);
            }}
            title="List Formatting Tools"
          >
            <span className="text-base">📝 Lists</span>
          </button>
          {showLists && (
            <div className="absolute z-50 mt-2 p-3 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[220px] left-0 md:left-auto">
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-2"
                onClick={() => {
                  props.onConvertToBullets?.();
                  setShowLists(false);
                }}
              >
                <span className="text-base">•</span> Convert to Bullets
              </button>
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-2"
                onClick={() => {
                  props.onConvertToNumbers?.();
                  setShowLists(false);
                }}
              >
                <span className="text-base">1.</span> Convert to Numbers
              </button>
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-2"
                onClick={() => {
                  props.onConvertToTasks?.();
                  setShowLists(false);
                }}
              >
                <span className="text-base">☑</span> Convert to Tasks
              </button>
              <div className="border-t border-white/10 my-2" />
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-2"
                onClick={() => {
                  props.onIndent?.();
                  setShowLists(false);
                }}
              >
                <span className="text-base">→</span> Indent
              </button>
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-2"
                onClick={() => {
                  props.onOutdent?.();
                  setShowLists(false);
                }}
              >
                <span className="text-base">←</span> Outdent
              </button>
            </div>
          )}
        </div>

        {/* Callouts/Alerts */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
            onClick={() => {
              setShowCallouts(!showCallouts);
              setShowLists(false);
              setShowLayouts(false);
              setShowTemplates(false);
            }}
            title="Insert Callouts & Dividers"
          >
            <span className="text-base">💬 Callouts</span>
          </button>
          {showCallouts && (
            <div className="absolute z-50 mt-2 p-3 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[220px] max-h-[480px] overflow-y-auto left-0 md:left-auto">
              {calloutTypes.map((type) => (
                <button
                  key={type.style}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-3"
                  onClick={() => {
                    props.onInsertCallout?.(type.style);
                    setShowCallouts(false);
                  }}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span>{type.name} Callout</span>
                </button>
              ))}
              <div className="border-t border-white/10 my-2" />
              {dividerStyles.map((div) => (
                <button
                  key={div.style}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation"
                  onClick={() => {
                    props.onInsertDivider?.(div.style);
                    setShowCallouts(false);
                  }}
                >
                  ✨ {div.name} Divider
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layouts */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
            onClick={() => {
              setShowLayouts(!showLayouts);
              setShowLists(false);
              setShowCallouts(false);
              setShowTemplates(false);
            }}
            title="Insert Column Layouts"
          >
            <span className="text-base">⚡ Layouts</span>
          </button>
          {showLayouts && (
            <div className="absolute z-50 mt-2 p-3 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[240px] left-0 md:left-auto">
              {layouts.map((layout) => (
                <button
                  key={layout.layout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-3"
                  onClick={() => {
                    props.onInsertLayout?.(layout.layout);
                    setShowLayouts(false);
                  }}
                >
                  <span className="text-xl">{layout.icon}</span>
                  <span>{layout.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Templates */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
            onClick={() => {
              setShowTemplates(!showTemplates);
              setShowLists(false);
              setShowCallouts(false);
              setShowLayouts(false);
              setShowMath(false);
            }}
            title="Insert Blog Templates"
          >
            <span className="text-base">🎨 Templates</span>
          </button>
          {showTemplates && (
            <div className="absolute z-50 mt-2 p-3 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[240px] max-h-[480px] overflow-y-auto left-0 md:left-auto">
              {blogTemplates.map((template) => (
                <button
                  key={template.template}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-3"
                  onClick={() => {
                    props.onInsertBlogTemplate?.(template.template);
                    setShowTemplates(false);
                  }}
                >
                  <span className="text-lg">{template.icon}</span>
                  <span>{template.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Math Equations */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
            onClick={() => {
              setShowMath(!showMath);
              setShowLists(false);
              setShowCallouts(false);
              setShowLayouts(false);
              setShowTemplates(false);
            }}
            title="Insert Math Equation"
          >
            <span className="text-base">∑ Math</span>
          </button>
          {showMath && (
            <div className="absolute z-50 mt-2 p-3 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[200px] left-0 md:left-auto">
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-3"
                onClick={() => {
                  props.onInsertMath?.("inline");
                  setShowMath(false);
                }}
              >
                <span className="text-lg">∫</span>
                <div>
                  <div className="font-medium">Inline Math</div>
                  <div className="text-xs text-white/60">$x^2 + y^2 = z^2$</div>
                </div>
              </button>
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation flex items-center gap-3"
                onClick={() => {
                  props.onInsertMath?.("block");
                  setShowMath(false);
                }}
              >
                <span className="text-lg">∑</span>
                <div>
                  <div className="font-medium">Block Math</div>
                  <div className="text-xs text-white/60">$$E = mc^2$$</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
