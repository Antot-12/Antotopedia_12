import { prisma, withDbRetry } from "@/lib/prisma";
import Link from "next/link";
import PostGrid from "@/components/PostGrid";
import { getLocale, getDictionary } from "@/lib/i18n";

type Search = { q?: string; page?: string };

type ListItem = {
    id: number | string;
    slug?: string | null;
    title?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    tags?: { name: string; slug?: string }[];
};

export const revalidate = 0;

export default async function BlogIndex(props: { searchParams: Promise<Search> }) {
    const locale = await getLocale();
    const dict = await getDictionary(locale);
    const { q = "", page = "1" } = await props.searchParams;
    const query = (q ?? "").toString().trim();
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = 12;

    const where: any = { status: "published" };
    if (query) {
        where.OR = [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ];
    }

    let total = 0;
    let rows: ListItem[] = [];

    try {
        total = await withDbRetry((p) => p.post.count({ where }));
        rows = await withDbRetry((p) =>
            p.post.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (pageNum - 1) * pageSize,
                take: pageSize,
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    description: true,
                    coverImageUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    tags: { select: { name: true, slug: true } },
                },
            })
        );
    } catch {
        total = 0;
        rows = [];
    }

    const list = rows.filter(Boolean).filter((p) => !!p.slug && !!p.title);
    const pages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="grid gap-4 sm:gap-6">
            <div className="card p-3 sm:p-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <form className="grid gap-2 sm:gap-3 md:grid-cols-[1fr_auto]">
                    <input name="q" defaultValue={query} placeholder={dict.blog?.searchPosts || "Search posts..."} className="input text-sm sm:text-base" />
                    <button className="btn btn-primary text-sm sm:text-base">{dict.common.search}</button>
                </form>
                <div className="text-xs sm:text-sm text-dim">{locale === "uk" ? "Сторінка" : "Page"} {pageNum} {locale === "uk" ? "з" : "of"} {pages}</div>
            </div>

            {list.length === 0 ? (
                <div className="card p-4 sm:p-6 text-dim text-sm sm:text-base">{dict.blog?.noPosts || "No posts found."}</div>
            ) : (
                <section className="grid gap-4 sm:gap-6">
                    <PostGrid posts={list} locale={locale} labels={dict.posts} />
                </section>
            )}

            <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                {Array.from({ length: pages }).map((_, i) => {
                    const n = i + 1;
                    const sp = new URLSearchParams({ q: query, page: String(n) }).toString();
                    return (
                        <Link key={n} href={`/blog?${sp}`} className={`btn text-xs sm:text-sm px-3 sm:px-4 ${n === pageNum ? "btn-primary" : "btn-soft"}`}>
                            {n}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
