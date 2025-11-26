import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const posts = prisma
    ? await prisma.post.findMany({ orderBy: { updatedAt: "desc" } })
    : [{ id: 1, title: "Demo Post", slug: "demo-post", status: "draft", updatedAt: new Date() }];

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin</h1>
        <Link href="/admin/editor/new" className="btn btn-primary">New post</Link>
      </div>
      <div className="overflow-auto card">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 sticky top-0">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Updated</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.slug}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3">{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/editor/${p.id}`} className="text-accent">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
