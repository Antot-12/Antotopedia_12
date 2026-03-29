"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { defaultSchema } from "hast-util-sanitize";
import { visit } from "unist-util-visit";
import "katex/dist/katex.min.css";

const colorRegex = /^color\s*:\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z()%,.\s-]+)\s*;?$/;
const fontSizeRegex = /^font-size\s*:\s*[\d.]+(?:px|em|rem)\s*;?$/;
const backgroundRegex = /^background\s*:\s*.+;?\s*;?$/;
const paddingRegex = /^padding\s*:\s*.+;?$/;
const borderRadiusRegex = /^border-radius\s*:\s*.+;?$/;

const schema = {
    ...defaultSchema,
    attributes: {
        ...(defaultSchema as any).attributes,
        span: [...((((defaultSchema as any).attributes || {}).span) || []), ["style", colorRegex], ["style", fontSizeRegex], ["className", /^katex.*$/]],
        mark: [...((((defaultSchema as any).attributes || {}).mark) || []), ["style", backgroundRegex], ["style", paddingRegex], ["style", borderRadiusRegex]],
        code: [...((((defaultSchema as any).attributes || {}).code) || []), ["className", /^language-[\w-]+$/]],
        pre: [...((((defaultSchema as any).attributes || {}).pre) || []), ["className", ".*"]],
        a: [...((((defaultSchema as any).attributes || {}).a) || []), ["target", /^_blank$/], ["rel", /^(noopener|noreferrer|nofollow)(\s+(noopener|noreferrer|nofollow))*$/], ["id", /^fn-.*$/], ["href", /^#fn.*$/]],
        img: [...((((defaultSchema as any).attributes || {}).img) || []), ["className", ".*"], ["alt", ".*"], ["src", ".*"], ["title", ".*"]],
        div: [...((((defaultSchema as any).attributes || {}).div) || []), ["className", /^(math.*|image-gallery)$/]],
        video: [...((((defaultSchema as any).attributes || {}).video) || []), ["src", ".*"], ["controls", ".*"], ["width", ".*"], ["height", ".*"], ["className", ".*"]],
        audio: [...((((defaultSchema as any).attributes || {}).audio) || []), ["src", ".*"], ["controls", ".*"], ["className", ".*"]],
        source: [...((((defaultSchema as any).attributes || {}).source) || []), ["src", ".*"], ["type", ".*"]],
    },
    tagNames: [...(((defaultSchema as any).tagNames) || []), "span", "mark", "div", "sup", "video", "audio", "source"],
};

function remarkUnwrapImages() {
    return (tree: any) => {
        visit(tree, "paragraph", (node: any, i: any, parent: any) => {
            if (!parent || typeof i !== "number") return;
            const onlyImage = node.children && node.children.length === 1 && node.children[0].type === "image";
            if (onlyImage) parent.children.splice(i, 1, node.children[0]);
        });
    };
}

function isCloudinaryUrl(u: string) {
    return /^https?:\/\/res\.cloudinary\.com\//i.test(u);
}

function injectCldTransform(u: string, t: string) {
    const m = u.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)(\/.*)$/i);
    if (!m) return u;
    const head = m[1];
    const tail = m[2].replace(/^\/+/, "");
    return `${head}/${t}/${tail}`;
}

function normalizeImageSrc(src: string, maxWidth = 1200) {
    if (!isCloudinaryUrl(src)) return src;
    return injectCldTransform(src, `f_auto,q_auto,c_limit,w_${maxWidth}`);
}

function parseImgDirectives(title?: string | null) {
    const raw = String(title || "").trim();
    if (!raw) return { title: "", opts: {} as Record<string, string> };
    const parts = raw.split("|").map(s => s.trim()).filter(Boolean);
    const baseTitle = parts[0] && !parts[0].includes("=") ? parts[0] : "";
    const opts: Record<string, string> = {};
    parts.slice(baseTitle ? 1 : 0).forEach(p => {
        const m = /^([a-zA-Z][\w-]*)=(.+)$/.exec(p);
        if (m) opts[m[1]] = m[2];
    });
    return { title: baseTitle, opts };
}

function buildImgStyle(opts: Record<string, string>) {
    const style: React.CSSProperties = {};
    if (opts.w) style.width = opts.w;
    if (opts.h) style.height = opts.h;
    if (opts.maxW) style.maxWidth = opts.maxW;
    if (opts.maxH) style.maxHeight = opts.maxH;
    if (opts.r) style.borderRadius = opts.r;
    return style;
}

function alignClass(a?: string) {
    if (a === "left") return "justify-start";
    if (a === "right") return "justify-end";
    return "justify-center";
}

function fitClass(f?: string) {
    if (f === "cover") return "object-cover";
    return "object-contain";
}

function slugifyHeading(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function extractToc(md?: string | null) {
    const lines = (md || "").split("\n");
    const items: { id: string; text: string; level: 2 | 3 }[] = [];
    for (const line of lines) {
        const m2 = /^##\s+(.+)$/.exec(line);
        const m3 = /^###\s+(.+)$/.exec(line);
        if (m2) items.push({ id: slugifyHeading(m2[1].trim()), text: m2[1].trim(), level: 2 });
        if (m3) items.push({ id: slugifyHeading(m3[1].trim()), text: m3[1].trim(), level: 3 });
    }
    return items.slice(0, 50);
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {}
    };
    return (
        <div className="relative">
            {language ? <span className="absolute left-2 top-2 text-[11px] uppercase tracking-wide text-white/60">{language}</span> : null}
            <button type="button" onClick={onCopy} className="absolute right-2 top-2 btn btn-ghost px-2 py-1 text-[11px]">Copy</button>
            <pre className="rounded-xl border border-white/10 bg-black/40 p-4 overflow-auto">
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>
        </div>
    );
}

function MermaidBlock({ code }: { code: string }) {
    const id = useId().replace(/:/g, "");
    const elRef = useRef<HTMLDivElement | null>(null);
    const [ok, setOk] = useState(false);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const mer = await import("mermaid");
                mer.default.initialize({ startOnLoad: false, theme: "dark" });
                const { svg } = await mer.default.render(id, code);
                if (!mounted) return;
                if (elRef.current) elRef.current.innerHTML = svg;
                setOk(true);
            } catch {
                setOk(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [code, id]);
    if (!ok) return <CodeBlock code={code} language="mermaid" />;
    return <div ref={elRef} className="rounded-xl border border-white/10 bg-black/30 p-3 overflow-auto" />;
}

const components: Components = {
    h2(props: any) {
        const text = String(props.children ?? "");
        const id = slugifyHeading(text);
        return (
            <h2 id={id}>
                <a href={`#${id}`} className="no-underline hover:underline">{props.children}</a>
            </h2>
        );
    },
    h3(props: any) {
        const text = String(props.children ?? "");
        const id = slugifyHeading(text);
        return (
            <h3 id={id}>
                <a href={`#${id}`} className="no-underline hover:underline">{props.children}</a>
            </h3>
        );
    },
    p(props: any) {
        // Check if parent is a list item - if so, render content inline without wrapper
        const { node } = props;
        if (node?.position?.start && node?.position?.end) {
            // If we're inside a list item, unwrap the paragraph
            return <>{props.children}</>;
        }
        return <p>{props.children}</p>;
    },
    li(props: any) {
        // Custom list item renderer to ensure inline content
        return <li>{props.children}</li>;
    },
    code(props: any) {
        const { inline, className, children } = props || {};
        if (inline) return <code className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[#2ee7d8] font-semibold">{children}</code>;
        return <code className={className}>{children}</code>;
    },
    pre(props: any) {
        const child: any = Array.isArray(props.children) ? props.children[0] : props.children;
        const raw = child?.props?.children;
        const code = Array.isArray(raw) ? raw.map((c: any) => (typeof c === "string" ? c : "")).join("") : String(raw ?? "");
        const cls = child?.props?.className || "";
        const lang = cls.replace("language-", "").trim() || undefined;
        if (lang === "mermaid") return <MermaidBlock code={code} />;
        return <CodeBlock code={code} language={lang} />;
    },
    a(props: any) {
        return <a {...props} target="_blank" rel="noopener noreferrer nofollow" className="text-[#2ee7d8] underline decoration-1 underline-offset-[3px] hover:decoration-2 hover:text-[#5df4e9] hover:shadow-[0_0_8px_rgba(46,231,216,0.4)] transition-all font-medium" />;
    },
    img(props: any) {
        const rawSrc = String(props.src || "");
        const parsed = parseImgDirectives(props.title);
        const caption = parsed.title || null;
        const opts = parsed.opts;
        const limitW = opts.maxW ? parseInt(String(opts.maxW).replace(/\D+/g, "") || "900", 10) : 900;
        const src = normalizeImageSrc(rawSrc, limitW);
        const style = buildImgStyle(opts);
        const justify = alignClass(opts.align);
        const fit = fitClass(opts.fit);
        return (
            <figure className={`my-6 not-prose w-full flex ${justify}`}>
                <img
                    src={src}
                    alt={props.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className={`max-w-full h-auto max-h-[480px] ${fit} rounded-xl border border-white/10`}
                    style={style}
                    referrerPolicy="no-referrer"
                />
                {caption ? <figcaption className="mt-2 text-center text-xs text-white/70 w-full">{caption}</figcaption> : null}
            </figure>
        );
    },
    input(props: any) {
        if (props.type === "checkbox") return <input {...props} type="checkbox" disabled className="align-middle mr-2 accent-[var(--accent)]" />;
        return <input {...props} />;
    },
    table(props: any) {
        return <table {...props} className="w-full border-collapse my-4 [&_th]:text-left [&_th]:border-b [&_td]:border-b border-white/10" />;
    },
};

export function Markdown({ value, className }: { value: string; className?: string }) {
    const plugins = useMemo(() => [remarkGfm, remarkMath, remarkUnwrapImages], []);
    const rehype = useMemo(
        () => [
            rehypeRaw,
            [rehypeSanitize, schema],
            rehypeKatex,
            [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }],
        ],
        []
    );
    return (
        <ReactMarkdown
            remarkPlugins={plugins}
            rehypePlugins={rehype as any}
            components={components}
            className={`prose prose-invert max-w-none ${className || ""}`}
        >
            {value}
        </ReactMarkdown>
    );
}
