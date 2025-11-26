import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const rows = await prisma.$queryRaw<Array<{ id: number; posts: number }>>`
    SELECT "Tag"."id" AS id, COUNT(*)::int AS posts
    FROM "_PostToTag"
           JOIN "Post" ON "_PostToTag"."A" = "Post"."id"
           JOIN "Tag"  ON "_PostToTag"."B" = "Tag"."id"
    WHERE "Post"."status" = 'published'
    GROUP BY "Tag"."id"
  `;

  const map = new Map<number, number>();
  rows.forEach((r) => map.set(r.id, Number(r.posts)));

  const payload = tags.map((t) => ({
    ...t,
    _count: { posts: map.get(t.id) ?? 0 },
  }));

  const filtered = payload.filter((t) => (t._count.posts ?? 0) > 0);

  return NextResponse.json({ tags: filtered });
}
