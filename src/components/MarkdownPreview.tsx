"use client";

type Props = { markdown: string };

function esc(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mdToHtml(md: string) {
    let s = md.replace(/\r\n/g, "\n");

    s = esc(s);

    s = s.replace(/```([\s\S]*?)```/g, (_, code) => {
        return `<pre><code>${code}</code></pre>`;
    });

    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");

    s = s.replace(/^###### (.*)$/gm, "<h6>$1</h6>");
    s = s.replace(/^##### (.*)$/gm, "<h5>$1</h5>");
    s = s.replace(/^#### (.*)$/gm, "<h4>$1</h4>");
    s = s.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    s = s.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    s = s.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    s = s.replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>");

    s = s.replace(
        /^(\s*(?:-|\*) .+(?:\n|$))+?/gm,
        (block) => {
            const items = block
                .trim()
                .split("\n")
                .map((l) => l.replace(/^(?:-|\*) /, ""))
                .map((x) => `<li>${x}</li>`)
                .join("");
            return `<ul>${items}</ul>`;
        }
    );

    s = s.replace(
        /^(\s*\d+\. .+(?:\n|$))+?/gm,
        (block) => {
            const items = block
                .trim()
                .split("\n")
                .map((l) => l.replace(/^\d+\. /, ""))
                .map((x) => `<li>${x}</li>`)
                .join("");
            return `<ol>${items}</ol>`;
        }
    );

    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img alt="$1" src="$2" />`);
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>`);

    s = s
        .split(/\n{2,}/)
        .map((p) =>
            /^(<h\d|<ul>|<ol>|<pre>|<blockquote>|<img )/.test(p.trim())
                ? p
                : `<p>${p.trim()}</p>`
        )
        .join("\n");

    return s;
}

export default function MarkdownPreview({ markdown }: Props) {
    const html = mdToHtml(markdown || "");
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
