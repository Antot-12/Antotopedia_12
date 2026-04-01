import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

function slugify(input: string) {
  return input
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
}

async function ensureTags(names: string[]) {
  const cleaned = Array.from(
      new Set((names || []).map((n) => String(n || "").trim()).filter(Boolean))
  );
  if (!cleaned.length) return [];
  const entries = cleaned.map((name) => ({ name, slug: slugify(name) }));
  const slugs = entries.map((e) => e.slug);
  const existing = await prisma.tag.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  const existingSlugs = new Set(existing.map((t) => t.slug));
  const toCreate = entries.filter((e) => !existingSlugs.has(e.slug));
  if (toCreate.length) {
    await prisma.tag.createMany({
      data: toCreate.map((e) => ({ slug: e.slug, name: e.name })),
      skipDuplicates: true,
    });
  }
  const all = await prisma.tag.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  return all.map((t) => ({ id: t.id }));
}

function getFolderFromPublicId(pid: string | null | undefined) {
  if (!pid) return null;
  const parts = pid.split("/");
  const idx = parts.indexOf("posts");
  if (idx >= 0 && idx + 1 < parts.length) return parts[idx + 1];
  return null;
}

function getFolderFromUrl(url: string | null | undefined) {
  if (!url) return null;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const after = url.slice(idx + marker.length);
  const parts = after.split("/");
  if (parts[0] === "posts" && parts.length >= 2) return parts[1];
  return null;
}

function extractPostFolderBase(post: {
  coverImagePublicId?: string | null;
  coverImageUrl?: string | null;
  contentMarkdown?: string | null;
}) {
  const byPid = getFolderFromPublicId(post.coverImagePublicId ?? null);
  if (byPid) return byPid;
  const byUrl = getFolderFromUrl(post.coverImageUrl ?? null);
  if (byUrl) return byUrl;
  const md = post.contentMarkdown ?? "";
  const m = md.match(/https?:\/\/[^\s)]+\/upload\/([^)\s]+)/);
  if (m && m[1]) {
    const parts = m[1].split("/");
    if (parts[0] === "posts" && parts.length >= 2) return parts[1];
  }
  return null;
}

async function deleteCloudinaryFolderForPost(post: {
  coverImagePublicId?: string | null;
  coverImageUrl?: string | null;
  contentMarkdown?: string | null;
}) {
  const base = extractPostFolderBase(post);
  if (!base) return;
  const prefix = `posts/${base}/`;
  try {
    await (cloudinary as any).api.delete_resources_by_prefix(prefix);
  } catch {}
  const folders = [`posts/${base}/cover`, `posts/${base}/images`, `posts/${base}`];
  for (const f of folders) {
    try {
      await (cloudinary as any).api.delete_folder(f);
    } catch {}
  }
}

async function cleanupOrphanTags() {
  await prisma.tag.deleteMany({
    where: {
      posts: {
        none: {},
      },
    },
  });
}

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum))
    return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const post = await prisma.post.findUnique({
    where: { id: idNum },
    include: {
      tags: { select: { id: true, name: true, slug: true } },
      reaction: true,
      i18n: true,
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const idNum = Number(id);
    if (!Number.isFinite(idNum))
      return NextResponse.json(
        { error: "INVALID_ID", message: "Invalid post ID" },
        { status: 400 }
      );

    const body = await req.json();
    const {
      title,
      description,
      contentMarkdown,
      status,
      coverImageUrl,
      coverImagePublicId,
      tags,
      i18n,
    } = body || {};

    const connectTags = await ensureTags(Array.isArray(tags) ? tags : []);

    const i18nData = Array.isArray(i18n)
        ? i18n
            .filter(
                (r: any) =>
                    r &&
                    typeof r.locale === "string" &&
                    typeof r.title === "string" &&
                    r.locale.length === 2
            )
            .map((r: any) => ({
              locale: String(r.locale).toLowerCase(),
              title: r.title,
              description: typeof r.description === "string" ? r.description : null,
              contentMarkdown:
                  typeof r.contentMarkdown === "string" ? r.contentMarkdown : null,
            }))
        : [];

    const updated = await prisma.post.update({
      where: { id: idNum },
      data: {
        title: typeof title === "string" ? title : undefined,
        description: typeof description === "string" ? description : undefined,
        contentMarkdown: typeof contentMarkdown === "string" ? contentMarkdown : undefined,
        status: status === "draft" || status === "published" ? status : undefined,
        coverImageUrl: typeof coverImageUrl === "string" ? coverImageUrl : undefined,
        coverImagePublicId:
            typeof coverImagePublicId === "string" ? coverImagePublicId : undefined,
        tags: {
          set: [],
          connect: connectTags,
        },
        i18n: Array.isArray(i18n)
            ? {
              deleteMany: { postId: idNum },
              createMany: {
                data: i18nData,
              },
            }
            : undefined,
      },
      include: {
        tags: { select: { id: true, name: true, slug: true } },
        reaction: true,
        i18n: true,
      },
    });

    await cleanupOrphanTags();

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating post:", error);

    // Handle Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "NOT_FOUND",
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    if (error.code?.startsWith("P")) {
      return NextResponse.json(
        {
          error: "DATABASE_ERROR",
          message: "Database operation failed",
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to update post",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum))
    return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const post = await prisma.post.findUnique({
    where: { id: idNum },
    select: {
      id: true,
      coverImageUrl: true,
      coverImagePublicId: true,
      contentMarkdown: true,
    },
  });

  if (!post) return NextResponse.json({ ok: true });

  await prisma.post.delete({ where: { id: idNum } });

  try {
    await cleanupOrphanTags();
  } catch {}

  try {
    await deleteCloudinaryFolderForPost(post);
  } catch {}

  return NextResponse.json({ ok: true });
}
