"use client";

import ColorMenu from "./color/ColorMenu";
import { useState } from "react";

type Props = {
    onH2Action: () => void;
    onH3Action: () => void;
    onBoldAction: () => void;
    onItalicAction: () => void;
    onStrikeAction: () => void;
    onCodeInlineAction: () => void;
    onCodeBlockAction: () => void;
    onQuoteAction: () => void;
    onListAction: () => void;
    onLinkAction: () => void;
    onImageAction: () => void;
    onTableAction: () => void;
    onPickAction: (hex: string) => void;
    onClearAction: () => void;
    onBeforeColorOpenAction?: () => void;
    onTextSizeAction?: (size: "small" | "normal" | "large" | "xlarge") => void;
    onHighlightAction?: (color: string) => void;
    onCopyFormatAction?: () => void;
    onPasteFormatAction?: () => void;
    onInsertPresetAction?: (preset: string) => void;
};

export default function Toolbar(props: Props) {
    const [showTextSize, setShowTextSize] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);
    const [showPresets, setShowPresets] = useState(false);

    const highlightColors = [
        { name: "Yellow", color: "rgba(255, 235, 59, 0.4)", icon: "🟡" },
        { name: "Green", color: "rgba(76, 175, 80, 0.4)", icon: "🟢" },
        { name: "Blue", color: "rgba(33, 150, 243, 0.4)", icon: "🔵" },
        { name: "Pink", color: "rgba(233, 30, 99, 0.4)", icon: "🔴" },
        { name: "Orange", color: "rgba(255, 152, 0, 0.4)", icon: "🟠" },
        { name: "Purple", color: "rgba(156, 39, 176, 0.4)", icon: "🟣" },
        { name: "Cyan", color: "rgba(0, 188, 212, 0.4)", icon: "🔵" },
        { name: "Lime", color: "rgba(205, 220, 57, 0.4)", icon: "🟢" },
        { name: "Teal", color: "rgba(0, 150, 136, 0.4)", icon: "🩵" },
        { name: "Amber", color: "rgba(255, 193, 7, 0.4)", icon: "🟡" },
        { name: "Red", color: "rgba(244, 67, 54, 0.4)", icon: "🔴" },
        { name: "Indigo", color: "rgba(63, 81, 181, 0.4)", icon: "🔵" },
    ];

    const textPresets = [
        {
            name: "Info Box",
            content: `> ℹ️ **Information**
>
> This is an informational callout box. Replace this text with your information.`,
        },
        {
            name: "Warning Box",
            content: `> ⚠️ **Warning**
>
> This is a warning message. Use it to highlight important cautions.`,
        },
        {
            name: "Success Box",
            content: `> ✅ **Success**
>
> This indicates a successful action or positive outcome.`,
        },
        {
            name: "Code Example",
            content: `\`\`\`javascript
// Your code here
function example() {
  return "Hello World";
}
\`\`\``,
        },
        {
            name: "Task List",
            content: `- [ ] Task 1
- [ ] Task 2
- [x] Completed task
- [ ] Task 4`,
        },
        {
            name: "Comparison Table",
            content: `| Feature | Option A | Option B |
|---------|----------|----------|
| Speed   | Fast     | Slow     |
| Price   | $$       | $        |
| Quality | High     | Medium   |`,
        },
        {
            name: "Highlighted Note",
            content: `<mark style="background:rgba(255, 235, 59, 0.4);padding:2px 4px;border-radius:3px">📌 Important note that needs attention</mark>`,
        },
        {
            name: "Styled Quote",
            content: `> *"A great quote goes here. Make it memorable and inspiring."*
>
> — Author Name`,
        },
    ];

    return (
        <div className="card p-2 overflow-x-auto">
            <div className="toolbar flex flex-wrap gap-1 min-w-max md:min-w-0">
                {/* Headings Group */}
                <div className="flex gap-1 items-center">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onH2Action}
                        title="Heading 2"
                    >
                        <span className="text-base">📝 H2</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onH3Action}
                        title="Heading 3"
                    >
                        <span className="text-base">📄 H3</span>
                    </button>
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Text Formatting Group */}
                <div className="flex gap-1 items-center flex-wrap">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onBoldAction}
                        title="Bold (Ctrl/Cmd+B)"
                    >
                        <span className="font-bold text-base">𝐁</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onItalicAction}
                        title="Italic (Ctrl/Cmd+I)"
                    >
                        <span className="italic text-base">𝐼</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onStrikeAction}
                        title="Strikethrough"
                    >
                        <span className="text-base">S̶</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onCodeInlineAction}
                        title="Inline Code"
                    >
                        <span className="text-base">💻</span>
                    </button>
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Content Group */}
                <div className="flex gap-1 items-center flex-wrap">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onCodeBlockAction}
                        title="Code Block"
                    >
                        <span className="text-base">📟</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onQuoteAction}
                        title="Quote Block"
                    >
                        <span className="text-base">💬</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onListAction}
                        title="List"
                    >
                        <span className="text-base">📋</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onLinkAction}
                        title="Insert Link"
                    >
                        <span className="text-base">🔗</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onImageAction}
                        title="Insert Image"
                    >
                        <span className="text-base">🖼️</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={props.onTableAction}
                        title="Insert Table"
                    >
                        <span className="text-base">📊</span>
                    </button>
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Styling Group */}
                <div className="flex gap-1 items-center flex-wrap">
                    {/* Text Size Menu */}
                    <div className="relative">
                        <button
                            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                            onClick={() => {
                                props.onBeforeColorOpenAction?.();
                                setShowTextSize(!showTextSize);
                                setShowHighlight(false);
                                setShowPresets(false);
                            }}
                            title="Text Size"
                        >
                            <span className="text-base">📏 Size</span>
                        </button>
                        {showTextSize && (
                            <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[160px] left-0 md:left-auto">
                                <button
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-xs touch-manipulation"
                                    onClick={() => {
                                        props.onTextSizeAction?.("small");
                                        setShowTextSize(false);
                                    }}
                                >
                                    🔹 Small Text
                                </button>
                                <button
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm touch-manipulation"
                                    onClick={() => {
                                        props.onTextSizeAction?.("normal");
                                        setShowTextSize(false);
                                    }}
                                >
                                    ▫️ Normal Text
                                </button>
                                <button
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-base touch-manipulation"
                                    onClick={() => {
                                        props.onTextSizeAction?.("large");
                                        setShowTextSize(false);
                                    }}
                                >
                                    🔸 Large Text
                                </button>
                                <button
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-lg touch-manipulation"
                                    onClick={() => {
                                        props.onTextSizeAction?.("xlarge");
                                        setShowTextSize(false);
                                    }}
                                >
                                    🔶 X-Large Text
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Highlight Menu */}
                    <div className="relative">
                        <button
                            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                            onClick={() => {
                                props.onBeforeColorOpenAction?.();
                                setShowHighlight(!showHighlight);
                                setShowTextSize(false);
                                setShowPresets(false);
                            }}
                            title="Highlight Color"
                        >
                            <span className="text-base">🎨 Highlight</span>
                        </button>
                        {showHighlight && (
                            <div className="absolute z-50 mt-2 p-3 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[280px] max-h-[420px] overflow-y-auto left-0 md:left-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {highlightColors.map((item) => (
                                        <button
                                            key={item.name}
                                            className="text-left px-4 py-3 rounded-lg hover:bg-white/10 transition flex items-center gap-3 min-h-[44px] touch-manipulation"
                                            onClick={() => {
                                                props.onHighlightAction?.(item.color);
                                                setShowHighlight(false);
                                            }}
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="text-sm">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <ColorMenu
                        onPickAction={props.onPickAction}
                        onClearAction={props.onClearAction}
                        onBeforeColorOpenAction={props.onBeforeColorOpenAction}
                    />
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Format Painter Group */}
                <div className="flex gap-1 items-center flex-wrap">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={() => {
                            props.onBeforeColorOpenAction?.();
                            props.onCopyFormatAction?.();
                        }}
                        title="Copy formatting from selected text"
                    >
                        <span className="text-base">📋</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={() => {
                            props.onBeforeColorOpenAction?.();
                            props.onPasteFormatAction?.();
                        }}
                        title="Paste formatting to selected text"
                    >
                        <span className="text-base">📄</span>
                    </button>
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Text Presets */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                        onClick={() => {
                            props.onBeforeColorOpenAction?.();
                            setShowPresets(!showPresets);
                            setShowTextSize(false);
                            setShowHighlight(false);
                        }}
                        title="Insert Template"
                    >
                        <span className="text-base">⚡ Presets</span>
                    </button>
                    {showPresets && (
                        <div className="absolute z-50 mt-2 p-3 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[240px] max-h-[480px] overflow-y-auto left-0 md:left-auto">
                            {textPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm min-h-[44px] touch-manipulation"
                                    onClick={() => {
                                        props.onInsertPresetAction?.(preset.content);
                                        setShowPresets(false);
                                    }}
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}