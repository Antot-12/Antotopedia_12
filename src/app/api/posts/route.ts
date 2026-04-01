import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeTags(tagNames: string[]) {
  return [...new Set((tagNames || []).map((t) => String(t || "").trim()).filter(Boolean))];
}

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

async function ensureTags(tagNames: string[]) {
  const cleaned = normalizeTags(tagNames);
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
      data: toCreate.map((e) => ({ name: e.name, slug: e.slug })),
      skipDuplicates: true,
    });
  }

  const all = await prisma.tag.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });

  return all;
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

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const where = status === "all" ? {} : { status: "published" as const };
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.slug || !body.title) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Slug and title are required",
          fields: {
            slug: !body.slug ? "required" : undefined,
            title: !body.title ? "required" : undefined,
          }
        },
        { status: 400 }
      );
    }

    const tagEntities = await ensureTags(Array.isArray(body.tags) ? body.tags : []);
    const i18nRaw = Array.isArray(body.i18n) ? body.i18n : [];
    const i18nData = i18nRaw
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
        }));

    const post = await prisma.post.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        contentMarkdown: body.contentMarkdown,
        status: body.status === "published" ? "published" : "draft",
        coverImageUrl: body.coverImageUrl,
        coverImagePublicId: body.coverImagePublicId,
        tags: { connect: tagEntities.map((t) => ({ id: t.id })) },
        i18n: i18nData.length
            ? {
              createMany: {
                data: i18nData,
              },
            }
            : undefined,
      },
      include: { i18n: true },
    });

    await cleanupOrphanTags();

    return NextResponse.json({ id: post.id, slug: post.slug });
  } catch (error: any) {
    console.error("Error creating post:", error);

    // Handle Prisma unique constraint violation
    if (error.code === "P2002") {
      const fields = error.meta?.target || [];
      return NextResponse.json(
        {
          error: "DUPLICATE_SLUG",
          message: "A post with this slug already exists",
          fields: fields.includes("slug") ? { slug: "duplicate" } : {},
        },
        { status: 409 }
      );
    }

    // Handle other Prisma errors
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
        message: "Failed to create post",
      },
      { status: 500 }
    );
  }
}
