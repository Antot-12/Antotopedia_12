"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PostDTO = {
  id?: number;
  title: string;
  slug: string;
  description?: string;
  contentMarkdown: string;
  status: "draft" | "published";
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  tags: string[];
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditorForm({ initial }: { initial?: Partial<PostDTO> }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [content, setContent] = useState(initial?.contentMarkdown ?? "");
  const [status, setStatus] = useState<PostDTO["status"]>((initial?.status as any) ?? "draft");
  const [coverUrl, setCoverUrl] = useState<string | undefined | null>(initial?.coverImageUrl ?? null);
  const [coverId, setCoverId] = useState<string | undefined | null>(initial?.coverImagePublicId ?? null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tab, setTab] = useState<"editor" | "markdown" | "preview">("editor");
  const postId = initial?.id;

  useEffect(() => {
    const fetchTags = async () => {
      const r = await fetch("/api/tags", { cache: "no-store" });
      const data = await r.json();
      setAllTags(data.map((t: any) => t.name));
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (!initial?.slug && title && !slug) {
      setSlug(slugify(title));
    }
  }, [title, slug, initial?.slug]);

  const handleUpload = useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    if (!r.ok) throw new Error("Upload failed");
    const data = await r.json();
    setCoverUrl(data.url);
    setCoverId(data.publicId);
  }, []);


  const body: PostDTO = useMemo(
    () => ({
      id: postId,
      title,
      slug,
      description,
      contentMarkdown: content,
      status,
      coverImageUrl: coverUrl ?? undefined,
      coverImagePublicId: coverId ?? undefined,
      tags
    }),
    [postId, title, slug, description, content, status, coverUrl, coverId, tags]
  );

  const save = useCallback(async (publish: boolean) => {
    const method = postId ? "PUT" : "POST";
    const url = postId ? `/api/posts/${postId}` : "/api/posts";
    const payload = { ...body, status: publish ? "published" : body.status };
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error("Save failed");
    const data = await r.json();
    router.replace(`/admin/editor/${data.id}`);
    router.refresh();
  }, [postId, body, router]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 grid gap-3">
          <input
            className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2 outline-none focus:border-neon"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2 outline-none focus:border-neon"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />
          <textarea
            className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2 outline-none focus:border-neon min-h-[80px]"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded-full border ${tab === "editor" ? "border-neon text-neon" : "border-white/15"}`}
              onClick={() => setTab("editor")}
            >
              Editor
            </button>
            <button
              className={`px-3 py-1 rounded-full border ${tab === "markdown" ? "border-neon text-neon" : "border-white/15"}`}
              onClick={() => setTab("markdown")}
            >
              Markdown
            </button>
            <button
              className={`px-3 py-1 rounded-full border ${tab === "preview" ? "border-neon text-neon" : "border-white/15"}`}
              onClick={() => setTab("preview")}
            >
              Preview
            </button>
          </div>
          {tab === "editor" && (
            <textarea
              className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2 outline-none focus:border-neon min-h-[400px]"
              placeholder="Write your content in Markdown"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          {tab === "markdown" && (
            <pre className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2 overflow-auto min-h-[400px] whitespace-pre-wrap">
              {content}
            </pre>
          )}
          {tab === "preview" && (
            <div className="rounded-xl bg-black/40 border border-white/15 px-3 py-2 min-h-[400px]">
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: "" }} />
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="space-y-4">
                  <div className="text-2xl font-semibold">{title || "Untitled"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid gap-3">
          <div className="rounded-xl border border-white/15 p-3">
            <div className="text-sm mb-2">Cover</div>
            {coverUrl ? <img src={coverUrl} alt="cover" className="w-full h-40 object-cover rounded-lg mb-2" /> : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
              className="text-sm"
            />
          </div>
          <div className="rounded-xl border border-white/15 p-3">
            <div className="text-sm mb-2">Status</div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-lg bg-black/40 border border-white/15 px-2 py-2 outline-none focus:border-neon"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
          <div className="rounded-xl border border-white/15 p-3">
            <div className="text-sm mb-2">Tags</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t) => (
                <span key={t} className="px-2 py-1 rounded-full border border-white/15 text-xs">
                  {t}
                </span>
              ))}
            </div>
            <input
              className="w-full rounded-lg bg-black/40 border border-white/15 px-2 py-2 outline-none focus:border-neon"
              placeholder="Add tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v && !tags.includes(v)) setTags([...tags, v]);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
              list="alltags"
            />
            <datalist id="alltags">
              {allTags.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => save(false)}
              className="px-4 py-2 rounded-xl border border-white/15 hover:border-neon hover:text-neon transition"
            >
              Save draft
            </button>
            <button
              onClick={() => save(true)}
              className="px-4 py-2 rounded-xl border border-neon text-neon"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
