"use client";

import { useState } from "react";

type ToolbarExtendedProps = {
    visible?: boolean;
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
    onBeforeOpenAction?: () => void;
};

export default function ToolbarExtended(props: ToolbarExtendedProps) {
    const [showTextAlign, setShowTextAlign] = useState(false);
    const [showBackgroundColor, setShowBackgroundColor] = useState(false);
    const [showLetterSpacing, setShowLetterSpacing] = useState(false);
    const [showLineHeight, setShowLineHeight] = useState(false);
    const [showTextTransform, setShowTextTransform] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showSpecialChars, setShowSpecialChars] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊",
        "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪",
        "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏",
        "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕",
        "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇",
        "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✨", "💫", "⭐", "🌟", "✅",
        "❌", "❗", "❓", "💯", "🔥", "💧", "💦", "💨", "🌈", "☀️", "🌙", "⭐",
        "💖", "💗", "💓", "💕", "💞", "💘", "❤️", "🧡", "💛", "💚", "💙", "💜",
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
        <div className={`card p-2 relative z-[100] animate-slideDown transition-all duration-300 ${props.visible ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'}`} style={{ overflow: props.visible ? 'visible' : 'hidden' }}>
            <div className="toolbar flex flex-wrap gap-1 min-w-max md:min-w-0 overflow-x-auto">
                {/* Text Formatting Extended */}
                <div className="flex gap-1 items-center">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onUnderlineAction}
                        title="Underline"
                    >
                        <span className="text-base underline">U</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onSubscriptAction}
                        title="Subscript"
                    >
                        <span className="text-base">X₂</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onSuperscriptAction}
                        title="Superscript"
                    >
                        <span className="text-base">X²</span>
                    </button>
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Text Alignment */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowTextAlign(!showTextAlign);
                        }}
                        title="Text Alignment"
                    >
                        <span className="text-base">↔️ Align</span>
                    </button>
                    {showTextAlign && (
                        <div
                            className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[160px] animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                                <button
                                    key={align}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                    onClick={() => {
                                        props.onTextAlignAction?.(align);
                                        setShowTextAlign(false);
                                    }}
                                >
                                    {align.charAt(0).toUpperCase() + align.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Background Color */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowBackgroundColor(!showBackgroundColor);
                        }}
                        title="Background Color"
                    >
                        <span className="text-base">🎨 BG</span>
                    </button>
                    {showBackgroundColor && (
                        <div
                            className="fixed z-[999999] p-3 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[200px] animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            {backgroundColors.map((bg) => (
                                <button
                                    key={bg.name}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation mb-1"
                                    style={{ backgroundColor: bg.color }}
                                    onClick={() => {
                                        props.onBackgroundColorAction?.(bg.color);
                                        setShowBackgroundColor(false);
                                    }}
                                >
                                    {bg.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Letter Spacing */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowLetterSpacing(!showLetterSpacing);
                        }}
                        title="Letter Spacing"
                    >
                        <span className="text-base">📐 Spacing</span>
                    </button>
                    {showLetterSpacing && (
                        <div
                            className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[160px] animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            {letterSpacings.map((spacing) => (
                                <button
                                    key={spacing.name}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                    onClick={() => {
                                        props.onLetterSpacingAction?.(spacing.value);
                                        setShowLetterSpacing(false);
                                    }}
                                >
                                    {spacing.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Line Height */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowLineHeight(!showLineHeight);
                        }}
                        title="Line Height"
                    >
                        <span className="text-base">📏 Height</span>
                    </button>
                    {showLineHeight && (
                        <div
                            className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[160px] animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            {lineHeights.map((height) => (
                                <button
                                    key={height.name}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                    onClick={() => {
                                        props.onLineHeightAction?.(height.value);
                                        setShowLineHeight(false);
                                    }}
                                >
                                    {height.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Text Transform */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowTextTransform(!showTextTransform);
                        }}
                        title="Text Transform"
                    >
                        <span className="text-base">Aa</span>
                    </button>
                    {showTextTransform && (
                        <div
                            className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[160px] animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            {[
                                { name: "UPPERCASE", value: "uppercase" },
                                { name: "lowercase", value: "lowercase" },
                                { name: "Capitalize", value: "capitalize" },
                            ].map((transform) => (
                                <button
                                    key={transform.value}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                    onClick={() => {
                                        props.onTextTransformAction?.(transform.value);
                                        setShowTextTransform(false);
                                    }}
                                >
                                    {transform.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Content Elements */}
                <div className="flex gap-1 items-center">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onHorizontalRuleAction}
                        title="Horizontal Rule"
                    >
                        <span className="text-base">➖</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onCollapsibleAction}
                        title="Collapsible Section"
                    >
                        <span className="text-base">📂</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onFootnoteAction}
                        title="Footnote"
                    >
                        <span className="text-base">📝</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onTaskListAction}
                        title="Task List"
                    >
                        <span className="text-base">☑️</span>
                    </button>
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Emoji Picker */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowEmoji(!showEmoji);
                        }}
                        title="Emoji"
                    >
                        <span className="text-base">😀</span>
                    </button>
                    {showEmoji && (
                        <div
                            className="fixed z-[999999] p-3 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm w-[320px] max-h-[400px] overflow-y-auto animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            <div className="grid grid-cols-8 gap-2">
                                {emojis.map((emoji, idx) => (
                                    <button
                                        key={idx}
                                        className="text-2xl p-2 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                        onClick={() => {
                                            props.onEmojiAction?.(emoji);
                                            setShowEmoji(false);
                                        }}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Special Characters */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowSpecialChars(!showSpecialChars);
                        }}
                        title="Special Characters"
                    >
                        <span className="text-base">Ω</span>
                    </button>
                    {showSpecialChars && (
                        <div
                            className="fixed z-[999999] p-3 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm w-[320px] max-h-[400px] overflow-y-auto animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            <div className="grid grid-cols-8 gap-2">
                                {specialChars.map((char, idx) => (
                                    <button
                                        key={idx}
                                        className="text-lg p-2 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                        onClick={() => {
                                            props.onSpecialCharAction?.(char);
                                            setShowSpecialChars(false);
                                        }}
                                    >
                                        {char}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Advanced */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowAdvanced(!showAdvanced);
                        }}
                        title="Advanced"
                    >
                        <span className="text-base">⚡ Advanced</span>
                    </button>
                    {showAdvanced && (
                        <div
                            className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[200px] animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                onClick={() => {
                                    props.onMathAction?.();
                                    setShowAdvanced(false);
                                }}
                            >
                                📐 Math Equation
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                onClick={() => {
                                    props.onMermaidAction?.();
                                    setShowAdvanced(false);
                                }}
                            >
                                📊 Mermaid Diagram
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                onClick={() => {
                                    props.onHtmlEmbedAction?.();
                                    setShowAdvanced(false);
                                }}
                            >
                                💻 HTML Embed
                            </button>
                        </div>
                    )}
                </div>

                {/* Media */}
                <div className="relative">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={() => {
                            props.onBeforeOpenAction?.();
                            closeAllMenus();
                            setShowMedia(!showMedia);
                        }}
                        title="Media"
                    >
                        <span className="text-base">📺 Media</span>
                    </button>
                    {showMedia && (
                        <div
                            className="fixed z-[999999] p-2 bg-black/95 border-2 border-accent rounded-xl shadow-xl backdrop-blur-sm min-w-[200px] animate-fadeIn"
                            style={{
                                boxShadow: '0 0 0 2px rgba(46, 231, 216, 0.3), 0 8px 32px rgba(0, 0, 0, 0.9)',
                                top: 'auto',
                                left: 'auto'
                            }}
                        >
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                onClick={() => {
                                    props.onVideoEmbedAction?.();
                                    setShowMedia(false);
                                }}
                            >
                                🎬 Video Embed
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                onClick={() => {
                                    props.onAudioEmbedAction?.();
                                    setShowMedia(false);
                                }}
                            >
                                🎵 Audio Embed
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                onClick={() => {
                                    props.onYoutubeEmbedAction?.();
                                    setShowMedia(false);
                                }}
                            >
                                ▶️ YouTube
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition touch-manipulation"
                                onClick={() => {
                                    props.onGifAction?.();
                                    setShowMedia(false);
                                }}
                            >
                                🎞️ GIF
                            </button>
                        </div>
                    )}
                </div>

                <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />

                {/* Productivity */}
                <div className="flex gap-1 items-center">
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onUndoAction}
                        title="Undo"
                    >
                        <span className="text-base">↶</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onRedoAction}
                        title="Redo"
                    >
                        <span className="text-base">↷</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onFindReplaceAction}
                        title="Find & Replace"
                    >
                        <span className="text-base">🔍</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onClearFormattingAction}
                        title="Clear Formatting"
                    >
                        <span className="text-base">🧹</span>
                    </button>
                    <button
                        className="btn btn-soft px-3 py-2 min-h-[44px] touch-manipulation hover:scale-105 transition-transform"
                        onClick={props.onShowHelpAction}
                        title="Help"
                    >
                        <span className="text-base">❓</span>
                    </button>
                </div>

                {/* Stats */}
                {(props.wordCount !== undefined || props.charCount !== undefined) && (
                    <>
                        <span className="mx-1 w-px h-8 bg-white/10 hidden md:block" />
                        <div className="flex gap-3 items-center px-3 text-xs text-dim">
                            {props.wordCount !== undefined && (
                                <span>Words: {props.wordCount}</span>
                            )}
                            {props.charCount !== undefined && (
                                <span>Chars: {props.charCount}</span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
