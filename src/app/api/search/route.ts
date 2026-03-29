import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const dateFrom = searchParams.get("from") || "";
    const dateTo = searchParams.get("to") || "";
    const sortBy = searchParams.get("sort") || "relevance";

    if (!query && tags.length === 0) {
      return NextResponse.json({ results: [], suggestions: [] });
    }

    // Build where clause
    const where: any = {
      status: "published",
    };

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { contentMarkdown: { contains: query, mode: "insensitive" } },
      ];
    }

    // Tag filter
    if (tags.length > 0) {
      where.tags = {
        some: {
          slug: { in: tags },
        },
      };
    }

    // Date filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Sort order
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "title") {
      orderBy = { title: "asc" };
    } else if (sortBy === "date") {
      orderBy = { createdAt: "desc" };
    }

    // Perform search
    const posts = await prisma.post.findMany({
      where,
      orderBy,
      take: 10, // Limit to 10 for autocomplete
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        coverImageUrl: true,
        contentMarkdown: true,
        createdAt: true,
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    // Generate excerpt from content
    const results = posts.map((post) => {
      let excerpt = post.description || "";
      if (!excerpt && query && post.contentMarkdown) {
        // Find the sentence containing the query
        const content = post.contentMarkdown.toLowerCase();
        const queryLower = query.toLowerCase();
        const index = content.indexOf(queryLower);
        if (index !== -1) {
          const start = Math.max(0, index - 50);
          const end = Math.min(content.length, index + query.length + 100);
          excerpt = "..." + post.contentMarkdown.substring(start, end) + "...";
        } else {
          excerpt = post.contentMarkdown.substring(0, 150) + "...";
        }
      }

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description,
        coverImageUrl: post.coverImageUrl,
        createdAt: post.createdAt.toISOString(),
        tags: post.tags,
        excerpt,
      };
    });

    // Generate suggestions (simple implementation)
    const suggestions: string[] = [];
    if (results.length === 0 && query) {
      // Suggest removing last word
      const words = query.trim().split(/\s+/);
      if (words.length > 1) {
        suggestions.push(words.slice(0, -1).join(" "));
      }
      // Suggest common terms if no results
      const allTags = await prisma.tag.findMany({
        take: 5,
        orderBy: { name: "asc" },
        select: { name: true },
      });
      suggestions.push(...allTags.map((t) => t.name));
    }

    return NextResponse.json({
      results,
      suggestions: suggestions.slice(0, 3),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", results: [], suggestions: [] },
      { status: 500 }
    );
  }
}
