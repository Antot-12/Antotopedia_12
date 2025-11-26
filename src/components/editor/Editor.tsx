"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Toolbar from "./Toolbar";
import StatusPanel from "./StatusPanel";
import PostMetadata from "./PostMetadata";
import { Markdown } from "@/lib/markdown";

type LocaleCode = "en" | "uk";

type TranslationFields = {
  title: string;
  description: string;
  contentMarkdown: string;
};

type PostForm = {
  id: number | null;
  title: string;
  slug: string;
  description: string;
  contentMarkdown: string;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  tags: string[];
  status: "draft" | "published";
};

type InitialI18n = {
  locale: string;
  title?: string | null;
  description?: string | null;
  contentMarkdown?: string | null;
};

type Props = {
  initial: Partial<PostForm> & {
    createdAt?: Date;
    i18n?: InitialI18n[];
  };
};

const EDIT_LOCALES: LocaleCode[] = ["uk", "en"];

function transliterateToLatin(input: string) {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    є: "ie",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ю: "iu",
    я: "ia",
    ь: "",
    ъ: "",
    ё: "e",
    ы: "y",
    э: "e",
  };
  let out = "";
  const lower = input.toLowerCase();
  for (const ch of lower) {
    if (map[ch] !== undefined) out += map[ch];
    else out += ch;
  }
  return out;
}

function slugify(s: string) {
  const transliterated = transliterateToLatin(s);
  const cleaned = transliterated
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  return cleaned.slice(0, 80);
}

function normalizeFolderName(s: string) {
  const v = slugify(s);
  return v || "untitled";
}

function buildInitialTranslations(initial: Props["initial"]): Record<LocaleCode, TranslationFields> {
  const base: TranslationFields = {
    title: initial.title ?? "",
    description: initial.description ?? "",
    contentMarkdown: initial.contentMarkdown ?? "",
  };
  const map: Record<LocaleCode, TranslationFields> = {
    uk: { title: "", description: "", contentMarkdown: "" },
    en: { title: "", description: "", contentMarkdown: "" },
  };
  map.en = { ...base };
  map.uk = { title: "", description: "", contentMarkdown: "" };
  const rows = Array.isArray(initial.i18n) ? initial.i18n : [];
  for (const r of rows) {
    const code = String(r.locale || "").toLowerCase() as LocaleCode;
    if (code !== "uk" && code !== "en") continue;
    map[code] = {
      title: r.title ?? "",
      description: r.description ?? "",
      contentMarkdown: r.contentMarkdown ?? "",
    };
  }
  return map;
}

export default function Editor({ initial }: Props) {
  const router = useRouter();

  const translationsInitial = buildInitialTranslations(initial);
  const initialActiveLocale: LocaleCode =
      translationsInitial.uk.title ||
      translationsInitial.uk.description ||
      translationsInitial.uk.contentMarkdown
          ? "uk"
          : "en";

  const defaults: PostForm = {
    id: (initial.id as number | null) ?? null,
    title: translationsInitial[initialActiveLocale].title,
    slug: initial.slug ?? "",
    description: translationsInitial[initialActiveLocale].description,
    contentMarkdown: translationsInitial[initialActiveLocale].contentMarkdown,
    coverImageUrl: initial.coverImageUrl ?? null,
    coverImagePublicId: initial.coverImagePublicId ?? null,
    tags: Array.isArray(initial.tags) ? (initial.tags as string[]) : [],
    status: (initial.status as PostForm["status"]) ?? "draft",
  };

  const [form, setForm] = useState<PostForm>(defaults);
  const [translations, setTranslations] = useState<Record<LocaleCode, TranslationFields>>(translationsInitial);
  const [activeLocale, setActiveLocale] = useState<LocaleCode>(initialActiveLocale);

  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview" | "markdown">("write");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const selRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const loadedRef = useRef(false);
  const userEditedSlugRef = useRef(false);

  const [postFolder, setPostFolder] = useState<string | null>(() => {
    const pid = initial.coverImagePublicId as string | undefined;
    if (pid && pid.includes("/")) {
      const parts = pid.split("/");
      const idx = parts.indexOf("posts");
      if (idx >= 0 && idx + 1 < parts.length) return parts[idx + 1];
    }
    const url = initial.coverImageUrl as string | undefined;
    if (url && url.includes("/upload/")) {
      const after = url.split("/upload/")[1] || "";
      const parts = after.split("/");
      if (parts[0] === "posts" && parts.length >= 2) return parts[1];
    }
    if (initial.slug) return normalizeFolderName(initial.slug);
    if (initial.title) return normalizeFolderName(initial.title);
    return null;
  });

  const ensurePostFolder = useCallback(() => {
    if (postFolder) return postFolder;
    const baseSource = form.slug || form.title || "untitled";
    const base = normalizeFolderName(baseSource);
    setPostFolder(base);
    return base;
  }, [postFolder, form.slug, form.title]);

  const draftKey = useMemo(
      () => `editor_draft_${defaults.id ? String(defaults.id) : "new"}`,
      [defaults.id]
  );

  const uploadToCloudinary = useCallback(
      async (file: File, kind: "cover" | "image") => {
        const base = ensurePostFolder();
        const fd = new FormData();
        fd.append("file", file);
        fd.append("postFolder", base);
        fd.append("kind", kind === "cover" ? "cover" : "image");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error(await res.text());
        return (await res.json()) as {
          url: string;
          publicId: string;
          folderBase: string;
        };
      },
      [ensurePostFolder]
  );

  const handleCoverUpload = async () => {
    if (!coverFile) {
      alert("Choose an image file first.");
      return;
    }
    try {
      setBusy(true);
      const data = await uploadToCloudinary(coverFile, "cover");
      setForm((f) => ({
        ...f,
        coverImageUrl: data.url,
        coverImagePublicId: data.publicId,
      }));
      alert("Cover uploaded");
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (loadedRef.current) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.form && saved.translations) {
          setForm((f) => ({ ...f, ...saved.form }));
          setTranslations((t) => ({ ...t, ...saved.translations }));
          const loc =
              saved.activeLocale === "uk" || saved.activeLocale === "en"
                  ? saved.activeLocale
                  : initialActiveLocale;
          setActiveLocale(loc);
        } else {
          setForm((f) => ({ ...f, ...saved }));
        }
      }
    } catch {}
    loadedRef.current = true;
  }, [draftKey, initialActiveLocale]);

  useEffect(() => {
    try {
      const { id: _omit, ...toSave } = form;
      const payload = {
        form: toSave,
        translations,
        activeLocale,
      };
      localStorage.setItem(draftKey, JSON.stringify(payload));
    } catch {}
  }, [form, translations, activeLocale, draftKey]);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      title: translations[activeLocale].title,
      description: translations[activeLocale].description,
      contentMarkdown: translations[activeLocale].contentMarkdown,
    }));
  }, [activeLocale, translations]);

  const primaryTitle = useMemo(() => {
    const fromEn = translations.en.title?.trim();
    const fromActive = translations[activeLocale].title?.trim();
    if (fromEn) return fromEn;
    if (fromActive) return fromActive;
    return form.title || "";
  }, [translations, activeLocale, form.title]);

  useEffect(() => {
    if (userEditedSlugRef.current) return;
    const auto = slugify(primaryTitle || "");
    if (!auto) return;
    if (form.slug !== auto) {
      setForm((prev) => ({ ...prev, slug: auto }));
    }
  }, [primaryTitle, form.slug]);

  const captureSelection = useCallback(() => {
    const ta = editorRef.current;
    if (!ta) return;
    selRef.current = { start: ta.selectionStart ?? 0, end: ta.selectionEnd ?? 0 };
  }, []);

  const insertAtCursor = (md: string) => {
    const ta = editorRef.current;
    const value = form.contentMarkdown;
    const start = selRef.current.start ?? ta?.selectionStart ?? 0;
    const end = selRef.current.end ?? ta?.selectionEnd ?? 0;
    const next = value.slice(0, start) + md + value.slice(end);
    setForm((f) => ({ ...f, contentMarkdown: next }));
    setTranslations((t) => ({
      ...t,
      [activeLocale]: {
        ...t[activeLocale],
        contentMarkdown: next,
      },
    }));
    requestAnimationFrame(() => {
      const pos = start + md.length;
      editorRef.current?.focus();
      editorRef.current?.setSelectionRange(pos, pos);
    });
  };

  const applyWrapAt = useCallback(
      (before: string, after = before, range?: { start: number; end: number }) => {
        const ta = editorRef.current;
        const value = form.contentMarkdown;
        const start = range?.start ?? ta?.selectionStart ?? 0;
        const end = range?.end ?? ta?.selectionEnd ?? 0;
        const selected = value.slice(start, end);
        const next = value.slice(0, start) + before + selected + after + value.slice(end);
        setForm((f) => ({ ...f, contentMarkdown: next }));
        setTranslations((t) => ({
          ...t,
          [activeLocale]: {
            ...t[activeLocale],
            contentMarkdown: next,
          },
        }));
        requestAnimationFrame(() => {
          if (!ta) return;
          ta.focus();
          ta.setSelectionRange(
              start + before.length,
              start + before.length + selected.length
          );
        });
      },
      [form.contentMarkdown, activeLocale]
  );

  const actions = useMemo(() => {
    return {
      h2: () => applyWrapAt("## ", ""),
      h3: () => applyWrapAt("### ", ""),
      bold: () => applyWrapAt("**", "**"),
      italic: () => applyWrapAt("_", "_"),
      strike: () => applyWrapAt("~~", "~~"),
      codeInline: () => applyWrapAt("`", "`"),
      codeBlock: () => applyWrapAt("```\n", "\n```"),
      quote: () => applyWrapAt("> ", ""),
      list: () => applyWrapAt("- ", ""),
      link: () => {
        const url = prompt("Link URL", "https://") || "";
        if (!url) return;
        applyWrapAt("[", `](${url})`);
      },
      image: () => {
        const url = prompt("Image URL") || "";
        if (!url) return;
        const alt = prompt("Alt text") || "";
        applyWrapAt(`![${alt}](`, `${url})`);
      },
      table: () => {
        const tpl = `| Col 1 | Col 2 |\n|------|------|\n| A1   | B1   |\n| A2   | B2   |\n`;
        applyWrapAt(tpl, "");
      },
      color: (hex: string) =>
          applyWrapAt(`<span style="color:${hex}">`, "</span>", selRef.current),
      clearColor: () =>
          applyWrapAt(`<span style="color:inherit">`, "</span>", selRef.current),
    };
  }, [applyWrapAt]);

  const normalizeTags = (raw: string) =>
      raw
          .split(/[,\s]+/)
          .map((t) => t.trim().replace(/^#/, ""))
          .filter(Boolean);

  const commitTagInput = useCallback(() => {
    if (!tagInput.trim()) return;
    const add = normalizeTags(tagInput);
    setTagInput("");
    setForm((f) => {
      const set = new Set([...(f.tags || []), ...add]);
      return { ...f, tags: Array.from(set).slice(0, 24) };
    });
  }, [tagInput]);

  const addTags = (value: string) => {
    const add = normalizeTags(value);
    if (!add.length) return;
    setForm((f) => {
      const set = new Set([...(f.tags || []), ...add]);
      return { ...f, tags: Array.from(set).slice(0, 24) };
    });
  };

  const removeTag = (t: string) =>
      setForm((f) => ({ ...f, tags: (f.tags || []).filter((x) => x !== t) }));

  const submitTo = async (status: PostForm["status"]) => {
    if (tagInput.trim()) commitTagInput();
    setBusy(true);
    setError(null);
    try {
      const rows = EDIT_LOCALES.map((loc) => ({
        locale: loc,
        ...translations[loc],
      })).filter(
          (r) =>
              r.title.trim() ||
              r.description.trim() ||
              r.contentMarkdown.trim()
      );
      const mainLocale: LocaleCode =
          (rows.find((r) => r.locale === "uk")?.locale as LocaleCode) ??
          (rows.find((r) => r.locale === "en")?.locale as LocaleCode) ??
          activeLocale;
      const main = translations[mainLocale];
      const payload: any = {
        ...form,
        status,
        title: main.title,
        description: main.description,
        contentMarkdown: main.contentMarkdown,
        i18n: rows.map((r) => ({
          locale: r.locale,
          title: r.title,
          description: r.description,
          contentMarkdown: r.contentMarkdown,
        })),
      };
      const isNew = !form.id;
      const url = isNew ? "/api/posts" : `/api/posts/${form.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || "Request failed");
      let data: any = {};
      try {
        data = await res.json();
      } catch {}
      window.dispatchEvent(new Event("tags:changed"));
      if (isNew && data?.id) {
        localStorage.removeItem(draftKey);
        router.push(`/admin/editor/${data.id}`);
      }
      if (status === "published") {
        const viewSlug = data?.slug || payload.slug;
        if (viewSlug) {
          const lang = mainLocale;
          window.open(
              `/blog/${viewSlug}?lang=${lang}`,
              "_blank",
              "noopener,noreferrer"
          );
        }
      }
      if (!isNew || !data?.id) {
        alert(status === "published" ? "Published" : "Saved");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!form.id) return;
    if (!confirm("Delete this post?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${form.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await res.json().catch(() => ({}));
      window.dispatchEvent(new Event("tags:changed"));
      alert("Deleted");
      router.push("/admin");
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "s") {
        e.preventDefault();
        submitTo("draft");
      } else if (k === "b") {
        e.preventDefault();
        actions.bold();
      } else if (k === "i") {
        e.preventDefault();
        actions.italic();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actions]);

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    const ta = editorRef.current;
    if (!ta) return;
    e.preventDefault();
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const value = form.contentMarkdown;
    const sel = value.slice(start, end);
    const linesStart = value.lastIndexOf("\n", start - 1) + 1;
    const linesEnd = value.indexOf("\n", end);
    const blockEnd = linesEnd === -1 ? value.length : linesEnd;
    const block = value.slice(linesStart, blockEnd);
    const indent = "  ";
    if (e.shiftKey) {
      const newBlock = block.replace(/^ {1,2}/gm, "");
      const delta = block.length - newBlock.length;
      const nextValue = value.slice(0, linesStart) + newBlock + value.slice(blockEnd);
      setForm((f) => ({ ...f, contentMarkdown: nextValue }));
      setTranslations((t) => ({
        ...t,
        [activeLocale]: { ...t[activeLocale], contentMarkdown: nextValue },
      }));
      requestAnimationFrame(() => {
        const d = Math.min(delta, sel.length);
        editorRef.current?.setSelectionRange(start - d, end - d);
      });
    } else {
      const newBlock = block.replace(/^/gm, indent);
      const linesCount = (block.match(/\n/g) || []).length + 1;
      const nextValue = value.slice(0, linesStart) + newBlock + value.slice(blockEnd);
      setForm((f) => ({ ...f, contentMarkdown: nextValue }));
      setTranslations((t) => ({
        ...t,
        [activeLocale]: { ...t[activeLocale], contentMarkdown: nextValue },
      }));
      requestAnimationFrame(() => {
        editorRef.current?.setSelectionRange(
            start + indent.length,
            end + indent.length * linesCount
        );
      });
    }
  };

  const handleInlineImageUpload = async (file: File) => {
    if (!file) return;
    try {
      setBusy(true);
      const data = await uploadToCloudinary(file, "image");
      const alt = file.name.replace(/\.[a-z0-9]+$/i, "");
      const md = `![${alt}](${data.url})`;
      const prefix =
          form.contentMarkdown.endsWith("\n") || form.contentMarkdown.length === 0
              ? ""
              : "\n\n";
      insertAtCursor(prefix + md + "\n");
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleFileDrop = async (dt: DataTransfer) => {
    if (!dt?.files?.length) return;
    const file = dt.files[0];
    if (!file.type.startsWith("image/")) return;
    try {
      setBusy(true);
      const data = await uploadToCloudinary(file, "image");
      const alt = file.name.replace(/\.[a-z0-9]+$/i, "");
      const md = `![${alt}](${data.url})`;
      const prefix =
          form.contentMarkdown.endsWith("\n") || form.contentMarkdown.length === 0
              ? ""
              : "\n\n";
      insertAtCursor(prefix + md + "\n");
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      setDragActive(false);
    }
  };

  const onDropDiv: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    void handleFileDrop(e.dataTransfer);
  };

  const onDropTextarea: React.DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    void handleFileDrop(e.dataTransfer);
  };

  const onDragOver: React.DragEventHandler<any> = (e) => {
    e.preventDefault();
  };

  const onDragEnter: React.DragEventHandler<any> = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave: React.DragEventHandler<any> = (e) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragActive(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const it of items as any) {
      if (it.kind === "file") {
        const file = it.getAsFile();
        if (file && file.type.startsWith("image/")) {
          e.preventDefault();
          try {
            setBusy(true);
            const data = await uploadToCloudinary(file, "image");
            const md = `![pasted-image](${data.url})`;
            const prefix =
                form.contentMarkdown.endsWith("\n") ||
                form.contentMarkdown.length === 0
                    ? ""
                    : "\n\n";
            insertAtCursor(prefix + md + "\n");
          } catch (err: any) {
            alert(err?.message || "Upload failed");
          } finally {
            setBusy(false);
          }
          break;
        }
      }
    }
  };

  const languageLabel =
      activeLocale === "uk"
          ? "Мова редагування"
          : "Editing language";

  return (
      <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="grid gap-4">
          <div className="grid gap-3">
            <div className="flex flex-col gap-2">
              <div className="grid md:grid-cols-2 gap-3">
                <input
                    className="input"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({
                        ...f,
                        title: v,
                      }));
                      setTranslations((t) => ({
                        ...t,
                        [activeLocale]: { ...t[activeLocale], title: v },
                      }));
                    }}
                />
                <input
                    className="input"
                    placeholder="Slug"
                    value={form.slug}
                    onChange={(e) => {
                      userEditedSlugRef.current = true;
                      setForm((f) => ({
                        ...f,
                        slug: slugify(e.target.value),
                      }));
                    }}
                />
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-xs text-dim">{languageLabel}</div>
                <div className="inline-flex gap-1 bg-black/40 rounded-full p-1 border border-white/10">
                  {EDIT_LOCALES.map((loc) => (
                      <button
                          key={loc}
                          type="button"
                          onClick={() => setActiveLocale(loc)}
                          className={
                              "h-8 px-3 rounded-full text-xs font-medium border transition inline-flex items-center justify-center min-w-[3rem] " +
                              (activeLocale === loc
                                  ? "bg-accent text-black border-accent"
                                  : "border-white/20 text-white/70 hover:border-accent/60 hover:text-accent")
                          }
                      >
                        {loc.toUpperCase()}
                      </button>
                  ))}
                </div>
              </div>
            </div>
            <input
                className="input"
                placeholder="Short description"
                value={form.description}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => ({
                    ...f,
                    description: v,
                  }));
                  setTranslations((t) => ({
                    ...t,
                    [activeLocale]: { ...t[activeLocale], description: v },
                  }));
                }}
            />
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <input
                    className="input"
                    placeholder="Cover image URL"
                    value={form.coverImageUrl ?? ""}
                    onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          coverImageUrl: e.target.value,
                        }))
                    }
                />
                <div className="flex items-center gap-2">
                  <input
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={(e) =>
                          setCoverFile(e.target.files?.[0] || null)
                      }
                  />
                  <button
                      type="button"
                      className="btn btn-soft"
                      disabled={busy || !coverFile}
                      onClick={handleCoverUpload}
                      title="Upload cover"
                  >
                    Upload
                  </button>
                </div>
                <div className="text-xs text-dim">
                  If URL is empty, the site will show <code>/no_image.jpg</code>.
                </div>
              </div>
              <div className="grid gap-2">
                <input
                    className="input"
                    placeholder="Tags: #design, #nextjs"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitTagInput();
                      }
                    }}
                    onBlur={commitTagInput}
                    onPaste={(e) => {
                      const text = e.clipboardData.getData("text");
                      if (text && /[, \n]/.test(text)) {
                        e.preventDefault();
                        addTags(text);
                        setTagInput("");
                      }
                    }}
                />
                {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((t) => (
                          <span key={t} className="chip">
                      #{t}
                            <button
                                className="btn-ghost text-xs px-2 py-0.5"
                                onClick={() => removeTag(t)}
                            >
                        ×
                      </button>
                    </span>
                      ))}
                    </div>
                )}
              </div>
            </div>
          </div>
          <div
              className={`card p-3 grid gap-3 relative ${
                  dragActive ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""
              }`}
              onDrop={onDropDiv}
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
          >
            <Toolbar
                onH2Action={() => {
                  captureSelection();
                  actions.h2();
                }}
                onH3Action={() => {
                  captureSelection();
                  actions.h3();
                }}
                onBoldAction={() => {
                  captureSelection();
                  actions.bold();
                }}
                onItalicAction={() => {
                  captureSelection();
                  actions.italic();
                }}
                onStrikeAction={() => {
                  captureSelection();
                  actions.strike();
                }}
                onCodeInlineAction={() => {
                  captureSelection();
                  actions.codeInline();
                }}
                onCodeBlockAction={() => {
                  captureSelection();
                  actions.codeBlock();
                }}
                onQuoteAction={() => {
                  captureSelection();
                  actions.quote();
                }}
                onListAction={() => {
                  captureSelection();
                  actions.list();
                }}
                onLinkAction={() => {
                  captureSelection();
                  actions.link();
                }}
                onImageAction={() => {
                  captureSelection();
                  actions.image();
                }}
                onTableAction={() => {
                  captureSelection();
                  actions.table();
                }}
                onPickAction={(hex) => {
                  actions.color(hex);
                }}
                onClearAction={() => {
                  actions.clearColor();
                }}
                onBeforeColorOpenAction={captureSelection}
            />
            <div className="flex items-center gap-2">
              <button
                  className={`btn ${
                      activeTab === "write" ? "btn-primary" : "btn-soft"
                  }`}
                  onClick={() => setActiveTab("write")}
                  type="button"
              >
                Write
              </button>
              <button
                  className={`btn ${
                      activeTab === "preview" ? "btn-primary" : "btn-soft"
                  }`}
                  onClick={() => setActiveTab("preview")}
                  type="button"
              >
                Preview
              </button>
              <button
                  className={`btn ${
                      activeTab === "markdown" ? "btn-primary" : "btn-soft"
                  }`}
                  onClick={() => setActiveTab("markdown")}
                  type="button"
              >
                Markdown
              </button>
              <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    if (f) void handleInlineImageUpload(f);
                    e.currentTarget.value = "";
                  }}
              />
              <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => imageInputRef.current?.click()}
              >
                Upload image
              </button>
            </div>
            {activeTab === "write" && (
                <textarea
                    ref={editorRef}
                    className="input min-h-[460px] font-mono"
                    value={form.contentMarkdown}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({
                        ...f,
                        contentMarkdown: v,
                      }));
                      setTranslations((t) => ({
                        ...t,
                        [activeLocale]: {
                          ...t[activeLocale],
                          contentMarkdown: v,
                        },
                      }));
                    }}
                    onKeyDown={handleTabKey}
                    onPaste={handlePaste}
                    onDrop={onDropTextarea}
                    onDragOver={onDragOver}
                    onSelect={captureSelection}
                    onKeyUp={captureSelection}
                    onMouseUp={captureSelection}
                    placeholder="Write your post in Markdown…"
                />
            )}
            {activeTab === "markdown" && (
                <pre className="rounded-xl border border-white/10 bg-black/40 p-3 overflow-auto whitespace-pre-wrap">
              {form.contentMarkdown}
            </pre>
            )}
            {activeTab === "preview" && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 max-h-[520px] overflow-auto">
                  <Markdown value={form.contentMarkdown} />
                </div>
            )}
            {dragActive && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-accent/60 bg-accent/5" />
            )}
          </div>
        </div>
        <aside className="grid gap-4">
          <StatusPanel
              status={form.status}
              busy={busy}
              canDelete={!!form.id}
              onChangeStatusAction={(s) =>
                  setForm((f) => ({
                    ...f,
                    status: s,
                  }))
              }
              onSaveDraftAction={() => submitTo("draft")}
              onPublishAction={() => submitTo("published")}
              onDeleteAction={onDelete}
              error={error}
          />
          <PostMetadata
              id={form.id}
              slug={form.slug}
              status={form.status}
              createdAt={initial.createdAt}
          />
        </aside>
      </div>
  );
}
