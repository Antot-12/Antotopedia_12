"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

type CodeBlockProps = {
  children: string;
  className?: string;
  inline?: boolean;
};

export default function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-javascript")
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  // Language display names
  const languageNames: { [key: string]: string } = {
    javascript: 'JavaScript',
    js: 'JavaScript',
    typescript: 'TypeScript',
    ts: 'TypeScript',
    jsx: 'JSX',
    tsx: 'TSX',
    python: 'Python',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    'c++': 'C++',
    c: 'C',
    csharp: 'C#',
    'c#': 'C#',
    cs: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    rb: 'Ruby',
    go: 'Go',
    golang: 'Go',
    rust: 'Rust',
    rs: 'Rust',
    swift: 'Swift',
    kotlin: 'Kotlin',
    kt: 'Kotlin',
    sql: 'SQL',
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    less: 'Less',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    toml: 'TOML',
    xml: 'XML',
    markdown: 'Markdown',
    md: 'Markdown',
    bash: 'Bash',
    sh: 'Shell',
    shell: 'Shell',
    powershell: 'PowerShell',
    ps1: 'PowerShell',
    dockerfile: 'Dockerfile',
    docker: 'Docker',
    graphql: 'GraphQL',
    gql: 'GraphQL',
    diff: 'Diff',
    git: 'Git',
    vim: 'Vim',
    lua: 'Lua',
    perl: 'Perl',
    r: 'R',
    matlab: 'MATLAB',
    scala: 'Scala',
    haskell: 'Haskell',
    clojure: 'Clojure',
    elixir: 'Elixir',
    erlang: 'Erlang',
    dart: 'Dart',
    vue: 'Vue',
    svelte: 'Svelte',
    angular: 'Angular',
    react: 'React',
    nginx: 'Nginx',
    apache: 'Apache',
    makefile: 'Makefile',
    cmake: 'CMake',
    latex: 'LaTeX',
    tex: 'TeX',
    solidity: 'Solidity',
    sol: 'Solidity',
    wasm: 'WebAssembly',
    wat: 'WebAssembly Text',
    asm: 'Assembly',
    nasm: 'NASM',
    text: 'Plain Text',
    txt: 'Plain Text',
    plaintext: 'Plain Text',
  };

  const displayLanguage = languageNames[language] || language.toUpperCase();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code
  if (inline) {
    return (
      <code className="inline-code">
        {children}
      </code>
    );
  }

  // Block code with syntax highlighting
  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-language">{displayLanguage}</span>
        <button
          onClick={handleCopy}
          className="code-block-copy-btn"
          title="Copy code"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.75rem 0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          maxWidth: '100%',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
        codeTagProps={{
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }
        }}
        showLineNumbers={true}
        wrapLines={true}
        wrapLongLines={true}
        PreTag="div"
        lineProps={{
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
