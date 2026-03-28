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
};

export default function AdvancedToolbar(props: Props) {
  const [showLists, setShowLists] = useState(false);
  const [showCallouts, setShowCallouts] = useState(false);
  const [showLayouts, setShowLayouts] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

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
    <div className="card p-2 mt-2">
      <div className="flex items-center gap-2 text-xs text-white/70 mb-2 uppercase tracking-wide">
        Advanced Formatting
      </div>

      <div className="toolbar">
        {/* List Tools */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-1"
            onClick={() => {
              setShowLists(!showLists);
              setShowCallouts(false);
              setShowLayouts(false);
              setShowTemplates(false);
            }}
          >
            📝 Lists
          </button>
          {showLists && (
            <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[180px]">
              <button
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                onClick={() => {
                  props.onConvertToBullets?.();
                  setShowLists(false);
                }}
              >
                • Convert to Bullets
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                onClick={() => {
                  props.onConvertToNumbers?.();
                  setShowLists(false);
                }}
              >
                1. Convert to Numbers
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                onClick={() => {
                  props.onConvertToTasks?.();
                  setShowLists(false);
                }}
              >
                ☑ Convert to Tasks
              </button>
              <div className="border-t border-white/10 my-2" />
              <button
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                onClick={() => {
                  props.onIndent?.();
                  setShowLists(false);
                }}
              >
                → Indent
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                onClick={() => {
                  props.onOutdent?.();
                  setShowLists(false);
                }}
              >
                ← Outdent
              </button>
            </div>
          )}
        </div>

        {/* Callouts/Alerts */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-1"
            onClick={() => {
              setShowCallouts(!showCallouts);
              setShowLists(false);
              setShowLayouts(false);
              setShowTemplates(false);
            }}
          >
            💬 Callouts
          </button>
          {showCallouts && (
            <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[180px]">
              {calloutTypes.map((type) => (
                <button
                  key={type.style}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm flex items-center gap-2"
                  onClick={() => {
                    props.onInsertCallout?.(type.style);
                    setShowCallouts(false);
                  }}
                >
                  <span>{type.icon}</span>
                  <span>{type.name}</span>
                </button>
              ))}
              <div className="border-t border-white/10 my-2" />
              {dividerStyles.map((div) => (
                <button
                  key={div.style}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                  onClick={() => {
                    props.onInsertDivider?.(div.style);
                    setShowCallouts(false);
                  }}
                >
                  {div.name} Divider
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layouts */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-1"
            onClick={() => {
              setShowLayouts(!showLayouts);
              setShowLists(false);
              setShowCallouts(false);
              setShowTemplates(false);
            }}
          >
            ⚡ Layouts
          </button>
          {showLayouts && (
            <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[200px]">
              {layouts.map((layout) => (
                <button
                  key={layout.layout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm flex items-center gap-2"
                  onClick={() => {
                    props.onInsertLayout?.(layout.layout);
                    setShowLayouts(false);
                  }}
                >
                  <span className="text-lg">{layout.icon}</span>
                  <span>{layout.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Templates */}
        <div className="relative">
          <button
            className="btn btn-soft px-3 py-1"
            onClick={() => {
              setShowTemplates(!showTemplates);
              setShowLists(false);
              setShowCallouts(false);
              setShowLayouts(false);
            }}
          >
            🎨 Templates
          </button>
          {showTemplates && (
            <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[200px] max-h-[400px] overflow-y-auto">
              {blogTemplates.map((template) => (
                <button
                  key={template.template}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm flex items-center gap-2"
                  onClick={() => {
                    props.onInsertBlogTemplate?.(template.template);
                    setShowTemplates(false);
                  }}
                >
                  <span>{template.icon}</span>
                  <span>{template.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
