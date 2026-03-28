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
        <div className="card p-2">
            <div className="toolbar">
                <button className="btn btn-soft px-3 py-1" onClick={props.onH2Action}>H2</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onH3Action}>H3</button>
                <span className="mx-1 w-px h-6 bg-white/10" />
                <button className="btn btn-soft px-3 py-1" onClick={props.onBoldAction}>Bold</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onItalicAction}>Italic</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onStrikeAction}>Strike</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onCodeInlineAction}>Code</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onCodeBlockAction}>Code block</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onQuoteAction}>Quote</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onListAction}>List</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onLinkAction}>Link</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onImageAction}>Image</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onTableAction}>Table</button>

                <span className="mx-1 w-px h-6 bg-white/10" />

                {/* Text Size Menu */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-1"
                        onClick={() => {
                            props.onBeforeColorOpenAction?.();
                            setShowTextSize(!showTextSize);
                            setShowHighlight(false);
                        }}
                    >
                        Size
                    </button>
                    {showTextSize && (
                        <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[140px]">
                            <button
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-xs"
                                onClick={() => {
                                    props.onTextSizeAction?.("small");
                                    setShowTextSize(false);
                                }}
                            >
                                Small
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                                onClick={() => {
                                    props.onTextSizeAction?.("normal");
                                    setShowTextSize(false);
                                }}
                            >
                                Normal
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-base"
                                onClick={() => {
                                    props.onTextSizeAction?.("large");
                                    setShowTextSize(false);
                                }}
                            >
                                Large
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-lg"
                                onClick={() => {
                                    props.onTextSizeAction?.("xlarge");
                                    setShowTextSize(false);
                                }}
                            >
                                X-Large
                            </button>
                        </div>
                    )}
                </div>

                {/* Highlight Menu */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-1"
                        onClick={() => {
                            props.onBeforeColorOpenAction?.();
                            setShowHighlight(!showHighlight);
                            setShowTextSize(false);
                        }}
                    >
                        Highlight
                    </button>
                    {showHighlight && (
                        <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[160px] max-h-[320px] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-1">
                                {highlightColors.map((item) => (
                                    <button
                                        key={item.name}
                                        className="text-left px-3 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2"
                                        onClick={() => {
                                            props.onHighlightAction?.(item.color);
                                            setShowHighlight(false);
                                        }}
                                    >
                                        <span
                                            className="w-4 h-4 rounded border border-white/30 flex-shrink-0"
                                            style={{ background: item.color }}
                                        />
                                        <span className="text-xs">{item.name}</span>
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

                <span className="mx-1 w-px h-6 bg-white/10" />

                {/* Format Painter */}
                <button
                    className="btn btn-soft px-3 py-1"
                    onClick={() => {
                        props.onBeforeColorOpenAction?.();
                        props.onCopyFormatAction?.();
                    }}
                    title="Copy formatting from selected text"
                >
                    📋 Copy Format
                </button>
                <button
                    className="btn btn-soft px-3 py-1"
                    onClick={() => {
                        props.onBeforeColorOpenAction?.();
                        props.onPasteFormatAction?.();
                    }}
                    title="Paste formatting to selected text"
                >
                    📄 Paste Format
                </button>

                {/* Text Presets */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-1"
                        onClick={() => {
                            props.onBeforeColorOpenAction?.();
                            setShowPresets(!showPresets);
                            setShowTextSize(false);
                            setShowHighlight(false);
                        }}
                    >
                        ⚡ Presets
                    </button>
                    {showPresets && (
                        <div className="absolute z-50 mt-2 p-2 bg-black/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-sm min-w-[200px] max-h-[400px] overflow-y-auto">
                            {textPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
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