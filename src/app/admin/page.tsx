import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getLocale, getDictionary } from "@/lib/i18n";

export default async function AdminPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const posts = prisma
    ? await prisma.post.findMany({ orderBy: { updatedAt: "desc" } })
    : [{ id: 1, title: "Demo Post", slug: "demo-post", status: "draft", updatedAt: new Date() }];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 grid gap-4 sm:gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-semibold">{dict.nav.admin}</h1>
        <Link href="/admin/editor/new" className="btn btn-primary min-h-[44px] touch-manipulation">
          ➕ {dict.admin.newPost}
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-auto card">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 sticky top-0">
            <tr>
              <th className="text-left px-4 py-3">{dict.admin.title}</th>
              <th className="text-left px-4 py-3">{dict.admin.slug}</th>
              <th className="text-left px-4 py-3">{dict.admin.status}</th>
              <th className="text-left px-4 py-3">{dict.admin.updated}</th>
              <th className="text-left px-4 py-3">{dict.admin.actions}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.slug}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {p.status === 'published' ? dict.admin.published : dict.admin.drafts}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/editor/${p.id}`} className="text-accent hover:underline">
                    {dict.admin.edit}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-3">
        {posts.map((p: any) => (
          <div key={p.id} className="card p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-semibold text-base flex-1">{p.title}</h2>
              <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {p.status === 'published' ? dict.admin.published : dict.admin.drafts}
              </span>
            </div>
            <div className="text-sm text-white/60 space-y-1 mb-3">
              <div className="flex gap-2">
                <span className="text-white/40">{dict.admin.slug}:</span>
                <span className="font-mono text-xs">{p.slug}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-white/40">{dict.admin.updated}:</span>
                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Link
              href={`/admin/editor/${p.id}`}
              className="btn btn-soft w-full min-h-[44px] touch-manipulation"
            >
              ✏️ {dict.admin.editPost}
            </Link>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="card p-8 text-center text-white/60">
          <div className="text-4xl mb-3">📝</div>
          <div className="text-lg mb-2">{dict.admin.noPosts}</div>
          <div className="text-sm">{dict.admin.createFirst}</div>
        </div>
      )}
    </div>
  );
}
