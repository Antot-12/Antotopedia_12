"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Draft = {
  key: string;
  id?: number | null;
  isNew: boolean;
  title: string;
  updatedAt: number;
};

export default function ContinueDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    const out: Draft[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || "";
      if (!k.startsWith("editor_draft_")) continue;
      try {
        const v = JSON.parse(localStorage.getItem(k) || "{}");
        const idStr = k.replace("editor_draft_", "");
        const idNum = /^\d+$/.test(idStr) ? Number(idStr) : null;
        const title =
            v?.form?.title ||
            v?.title ||
            "Untitled";
        out.push({
          key: k,
          id: idNum,
          isNew: idNum == null,
          title,
          updatedAt: Date.now(),
        });
      } catch {}
    }
    out.sort((a, b) => b.updatedAt - a.updatedAt);
    setDrafts(out.slice(0, 5));
  }, []);

  function clearDraft(key: string) {
    try {
      localStorage.removeItem(key);
      setDrafts((d) => d.filter((x) => x.key !== key));
    } catch {}
  }

  return (
      <section className="card p-4">
        <h3 className="text-lg font-semibold mb-3">Continue writing</h3>
        {drafts.length === 0 ? (
            <div className="text-dim text-sm">No drafts found</div>
        ) : (
            <div className="grid gap-2">
              {drafts.map((d) => {
                const href = d.isNew ? "/admin/editor/new" : `/admin/editor/${d.id}`;
                return (
                    <div key={d.key} className="flex items-center justify-between gap-2">
                      <Link href={href} className="truncate hover:text-accent">
                        {d.title}
                      </Link>
                      <button
                          className="btn btn-ghost text-sm"
                          onClick={() => clearDraft(d.key)}
                      >
                        Clear
                      </button>
                    </div>
                );
              })}
            </div>
        )}
      </section>
  );
}
