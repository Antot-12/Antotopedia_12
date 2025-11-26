import { prisma } from "@/lib/prisma";
import TagList, { TagItem } from "@/app/api/tags/TagList";
import TagFilters from "@/app/api/tags/TagFilters";
import { getLocale, getDictionary } from "@/lib/i18n";

export const revalidate = 0;

type Search = { q?: string; sort?: string; view?: string; min?: string };

export default async function TagsPage(props: { searchParams: Promise<Search> }) {
    const { q = "", sort = "popular", view = "list", min = "0" } = await props.searchParams;
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    const query = q.toString().trim().toLowerCase();
    const mode = (["popular", "alpha", "recent"].includes(sort as any) ? sort : "popular") as
        | "popular"
        | "alpha"
        | "recent";
    const viewMode = (["list", "cloud"].includes(view as any) ? view : "list") as "list" | "cloud";
    const minCount = Math.max(0, Number(min) || 0);

    const hasDb = !!prisma && !!(prisma as any).tag?.findMany;

    let tags: TagItem[] = [];

    if (hasDb) {
        const baseTags = await prisma.tag.findMany({
            orderBy: { name: "asc" },
            select: { id: true, slug: true, name: true },
        });

        const rows = await prisma.$queryRaw<Array<{ id: number; posts: number }>>`
      SELECT "Tag"."id" AS id, COUNT(*)::int AS posts
      FROM "_PostToTag"
      JOIN "Post" ON "_PostToTag"."A" = "Post"."id"
      JOIN "Tag"  ON "_PostToTag"."B" = "Tag"."id"
      WHERE "Post"."status" = 'published'
      GROUP BY "Tag"."id"
    `;

        const countMap = new Map<number, number>();
        rows.forEach((r) => countMap.set(r.id, Number(r.posts)));

        tags = baseTags
            .map((t) => ({
                id: t.id,
                slug: t.slug,
                name: t.name,
                count: countMap.get(t.id) ?? 0,
            }))
            .filter((t) => t.count > 0);
    } else {
        tags = [
            { id: 1, slug: "demo", name: "demo", count: 12 },
            { id: 2, slug: "nextjs", name: "nextjs", count: 7 },
            { id: 3, slug: "prisma", name: "prisma", count: 4 },
            { id: 4, slug: "tips", name: "tips", count: 9 },
        ];
    }

    if (query) {
        tags = tags.filter(
            (t) => t.name.toLowerCase().includes(query) || t.slug.toLowerCase().includes(query)
        );
    }

    if (minCount > 0) {
        tags = tags.filter((t) => t.count >= minCount);
    }

    if (mode === "alpha") tags.sort((a, b) => a.name.localeCompare(b.name));
    else if (mode === "recent") tags.sort((a, b) => b.id - a.id);
    else tags.sort((a, b) => b.count - a.count);

    const tTitle = dict?.tags?.browse ?? "Tags";
    const tTotalTags = dict?.tags?.total_tags ?? "tags";

    return (
        <div className="grid gap-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className="text-2xl font-semibold">{tTitle}</h1>
                <div className="text-sm text-dim">
                    {tags.length} {tTotalTags}
                </div>
            </div>
            <TagFilters q={q.toString()} sort={mode} view={viewMode} min={String(minCount)} dict={dict} />
            <TagList tags={tags} q={query} view={viewMode} min={minCount} dict={dict} />
        </div>
    );
}
