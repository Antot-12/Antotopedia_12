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

  let raw: any[] = [];
  if (hasDb) {
    raw = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
  } else {
    raw = [
      { id: 1, slug: "demo", name: "demo", _count: { posts: 12 } },
      { id: 2, slug: "nextjs", name: "nextjs", _count: { posts: 7 } },
      { id: 3, slug: "prisma", name: "prisma", _count: { posts: 4 } },
      { id: 4, slug: "tips", name: "tips", _count: { posts: 9 } },
    ];
  }

  let tags: TagItem[] = raw.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    count: Number(t._count?.posts ?? 0),
  }));

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
