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
    onFontSizeAction?: (size: string) => void;
    onFontFamilyAction?: (font: string) => void;
    onUnderlineAction?: () => void;
    onSubscriptAction?: () => void;
    onSuperscriptAction?: () => void;
    onTextAlignAction?: (align: "left" | "center" | "right" | "justify") => void;
    onBackgroundColorAction?: (color: string) => void;
    onLetterSpacingAction?: (spacing: string) => void;
    onLineHeightAction?: (height: string) => void;
    onTextTransformAction?: (transform: string) => void;
    onHorizontalRuleAction?: () => void;
    onCollapsibleAction?: () => void;
    onFootnoteAction?: () => void;
    onTaskListAction?: () => void;
    onEmojiAction?: (emoji: string) => void;
    onSpecialCharAction?: (char: string) => void;
    onMathAction?: () => void;
    onMermaidAction?: () => void;
    onHtmlEmbedAction?: () => void;
    onVideoEmbedAction?: () => void;
    onAudioEmbedAction?: () => void;
    onGifAction?: () => void;
    onYoutubeEmbedAction?: () => void;
    onUndoAction?: () => void;
    onRedoAction?: () => void;
    onFindReplaceAction?: () => void;
    onClearFormattingAction?: () => void;
    onShowHelpAction?: () => void;
    wordCount?: number;
    charCount?: number;
    onToggleExtendedToolbar?: () => void;
    showExtendedToolbar?: boolean;
};

export default function Toolbar(props: Props) {
    const [showTextSize, setShowTextSize] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [showFontFamily, setShowFontFamily] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const [showTextAlign, setShowTextAlign] = useState(false);
    const [showBackgroundColor, setShowBackgroundColor] = useState(false);
    const [showLetterSpacing, setShowLetterSpacing] = useState(false);
    const [showLineHeight, setShowLineHeight] = useState(false);
    const [showTextTransform, setShowTextTransform] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showSpecialChars, setShowSpecialChars] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const fontSizes = [
        { name: "10px", value: "10px" },
        { name: "12px", value: "12px" },
        { name: "14px", value: "14px" },
        { name: "16px", value: "16px" },
        { name: "18px", value: "18px" },
        { name: "20px", value: "20px" },
        { name: "24px", value: "24px" },
        { name: "28px", value: "28px" },
        { name: "32px", value: "32px" },
        { name: "36px", value: "36px" },
        { name: "48px", value: "48px" },
        { name: "64px", value: "64px" },
    ];

    const fontFamilies = [
        { name: "System Sans-serif", value: "system-ui, sans-serif" },
        { name: "Sans-serif", value: "sans-serif" },
        { name: "Serif", value: "serif" },
        { name: "Monospace", value: "monospace" },
        { name: "Arial", value: "Arial, sans-serif" },
        { name: "Helvetica", value: "Helvetica, sans-serif" },
        { name: "Times New Roman", value: "Times New Roman, serif" },
        { name: "Georgia", value: "Georgia, serif" },
        { name: "Courier New", value: "Courier New, monospace" },
        { name: "Verdana", value: "Verdana, sans-serif" },
        { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
        { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
        { name: "Impact", value: "Impact, sans-serif" },
        { name: "JetBrains Mono", value: "JetBrains Mono, monospace" },
        { name: "Fira Code", value: "Fira Code, monospace" },
        { name: "Source Code Pro", value: "Source Code Pro, monospace" },
        { name: "Consolas", value: "Consolas, monospace" },
        { name: "Inter", value: "Inter, sans-serif" },
        { name: "Roboto", value: "Roboto, sans-serif" },
        { name: "Open Sans", value: "Open Sans, sans-serif" },
        { name: "Lato", value: "Lato, sans-serif" },
        { name: "Montserrat", value: "Montserrat, sans-serif" },
        { name: "Poppins", value: "Poppins, sans-serif" },
        { name: "Playfair Display", value: "Playfair Display, serif" },
        { name: "Merriweather", value: "Merriweather, serif" },
    ];

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

    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊",
        "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪",
        "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏",
        "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕",
        "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓",
        "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧",
        "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫",
        "🥱", "😤", "😡", "😠", "🤬", "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘",
        "🤙", "👈", "👉", "👆", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏",
        "✨", "💫", "⭐", "🌟", "✅", "❌", "❗", "❓", "💯", "🔥", "💧", "💦",
        "💨", "🌈", "☀️", "🌙", "⭐", "💖", "💗", "💓", "💕", "💞", "💘", "❤️",
    ];

    const specialChars = [
        "©", "®", "™", "§", "¶", "†", "‡", "•", "°", "¢", "£", "¥", "€",
        "←", "→", "↑", "↓", "↔", "↕", "⇐", "⇒", "⇑", "⇓", "⇔", "⇕",
        "∀", "∂", "∃", "∅", "∇", "∈", "∉", "∋", "∏", "∑", "−", "∗", "√",
        "∝", "∞", "∠", "∧", "∨", "∩", "∪", "∫", "∴", "∼", "≅", "≈", "≠",
        "≡", "≤", "≥", "⊂", "⊃", "⊄", "⊆", "⊇", "⊕", "⊗", "⊥", "⋅",
        "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "λ", "μ", "π", "σ", "φ", "ψ", "ω",
        "Α", "Β", "Γ", "Δ", "Θ", "Λ", "Ξ", "Π", "Σ", "Φ", "Ψ", "Ω",
    ];

    const letterSpacings = [
        { name: "Tighter", value: "-0.05em" },
        { name: "Tight", value: "-0.025em" },
        { name: "Normal", value: "0" },
        { name: "Wide", value: "0.025em" },
        { name: "Wider", value: "0.05em" },
        { name: "Widest", value: "0.1em" },
    ];

    const lineHeights = [
        { name: "Tight", value: "1.25" },
        { name: "Snug", value: "1.375" },
        { name: "Normal", value: "1.5" },
        { name: "Relaxed", value: "1.625" },
        { name: "Loose", value: "2" },
    ];

    const backgroundColors = [
        { name: "Yellow", color: "rgba(255, 235, 59, 0.2)" },
        { name: "Green", color: "rgba(76, 175, 80, 0.2)" },
        { name: "Blue", color: "rgba(33, 150, 243, 0.2)" },
        { name: "Pink", color: "rgba(233, 30, 99, 0.2)" },
        { name: "Orange", color: "rgba(255, 152, 0, 0.2)" },
        { name: "Purple", color: "rgba(156, 39, 176, 0.2)" },
        { name: "Cyan", color: "rgba(0, 188, 212, 0.2)" },
        { name: "Red", color: "rgba(244, 67, 54, 0.2)" },
    ];

    const closeAllMenus = () => {
        setShowTextSize(false);
        setShowHighlight(false);
        setShowPresets(false);
        setShowFontFamily(false);
        setShowFontSize(false);
        setShowTextAlign(false);
        setShowBackgroundColor(false);
        setShowLetterSpacing(false);
        setShowLineHeight(false);
        setShowTextTransform(false);
        setShowEmoji(false);
        setShowSpecialChars(false);
        setShowMedia(false);
        setShowAdvanced(false);
    };

    return (
        <div className="card p-2 relative z-[100]" style={{ overflow: 'visible' }}>
            <div className="toolbar flex flex-wrap gap-1 min-w-max md:min-w-0 overflow-x-auto">
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
                    {/* Font Size Menu */}
                    <div className="relative">
                        <button
                            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                            onClick={() => {
                                props.onBeforeColorOpenAction?.();
                                setShowFontSize(!showFontSize);
                                setShowFontFamily(false);
                                setShowHighlight(false);
                                setShowPresets(false);
                            }}
                            title="Change text size"
                        >
                            <span className="text-base">📏 Size</span>
                        </button>
                        {showFontSize && (
                            <div
                                className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[160px]"
                                style={{
                                    boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                    top: 'auto',
                                    left: 'auto'
                                }}
                            >
                                {fontSizes.map((size) => (
                                    <button
                                        key={size.value}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                        onClick={() => {
                                            props.onFontSizeAction?.(size.value);
                                            setShowFontSize(false);
                                        }}
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Font Family Menu */}
                    <div className="relative">
                        <button
                            className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation"
                            onClick={() => {
                                props.onBeforeColorOpenAction?.();
                                setShowFontFamily(!showFontFamily);
                                setShowFontSize(false);
                                setShowHighlight(false);
                                setShowPresets(false);
                            }}
                            title="Change font family"
                        >
                            <span className="text-base">🔤 Font</span>
                        </button>
                        {showFontFamily && (
                            <div
                                className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[180px]"
                                style={{
                                    boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                    top: 'auto',
                                    left: 'auto'
                                }}
                            >
                                {fontFamilies.map((font) => (
                                    <button
                                        key={font.value}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-sm touch-manipulation"
                                        style={{ fontFamily: font.value }}
                                        onClick={() => {
                                            props.onFontFamilyAction?.(font.value);
                                            setShowFontFamily(false);
                                        }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
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
                                setShowFontSize(false);
                                setShowFontFamily(false);
                                setShowPresets(false);
                            }}
                            title="Highlight Color"
                        >
                            <span className="text-base">🎨 Highlight</span>
                        </button>
                        {showHighlight && (
                            <div
                                className="fixed z-[999999] p-3 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[280px] max-h-[420px] overflow-y-auto"
                                style={{
                                    boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                    top: 'auto',
                                    left: 'auto'
                                }}
                            >
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
                            setShowFontSize(false);
                            setShowFontFamily(false);
                            setShowHighlight(false);
                        }}
                        title="Insert Template"
                    >
                        <span className="text-base">⚡ Presets</span>
                    </button>
                    {showPresets && (
                        <div
                            className="fixed z-[999999] p-3 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[240px] max-h-[480px] overflow-y-auto"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
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

                {/* Toggle Extended Toolbar Button */}
                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />
                <button
                    className={`btn ${props.showExtendedToolbar ? 'btn-primary' : 'btn-soft'} px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform`}
                    onClick={props.onToggleExtendedToolbar}
                    title={props.showExtendedToolbar ? "Hide Extended Toolbar" : "Show Extended Toolbar"}
                >
                    <span className="text-base">
                        {props.showExtendedToolbar ? '🔼 Less' : '🔽 More'}
                    </span>
                </button>
            </div>
        </div>
    );
}