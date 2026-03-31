import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Hero from "@/components/Hero";
import QuickSearch from "@/components/QuickSearch";
import QuickActions from "@/components/QuickActions";
import TrendingTags from "@/components/TrendingTags";
import RecentPosts from "@/components/RecentPosts";
import QuickLinks from "@/components/QuickLinks";
import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n";

export const revalidate = 0;

type PostListItem = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    coverImageUrl: string | null;
    createdAt?: string | Date | null;
    tags?: { name: string; slug?: string }[];
};

export default async function HomePage() {
    const user = await getCurrentUser();
    const locale = await getLocale();
    const dict = await getDictionary(locale);
    const hasDb = !!prisma && !!(prisma as any).post?.findMany;

    const posts: PostListItem[] = hasDb
        ? await prisma.post.findMany({
            where: { status: "published" },
            orderBy: { createdAt: "desc" },
            take: 12,
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                coverImageUrl: true,
                createdAt: true,
                tags: { select: { name: true, slug: true } },
            },
        })
        : (Array.from({ length: 12 }).map((_, i) => ({
            id: i + 1,
            slug: `demo-post-${i + 1}`,
            title: `Demo Post ${i + 1}`,
            description: "This is a demo post (no DB connected)",
            coverImageUrl: null,
            tags: [
                { name: "demo", slug: "demo" },
                { name: `test-${i}`, slug: `test-${i}` },
            ],
        })) as any);

    const tags = hasDb
        ? await prisma.tag.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { posts: true } } },
        })
        : [{ id: 1, slug: "demo", name: "demo", _count: { posts: 12 } }];

    const featured = posts[0];
    const recent = posts;
    const popular = posts.slice(6, 12);

    return (
        <div className="grid gap-6 sm:gap-8 lg:gap-10">
            <Hero title={dict.hero.title} subtitle={dict.hero.subtitle_short} />
            {user ? (
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="grid gap-4 sm:gap-6">
                        <QuickSearch />
                        <RecentPosts
                            featured={featured as any}
                            posts={recent as any}
                            maxTagsFeatured={Infinity}
                            maxTagsCard={6}
                            centerFeatured
                            locale={locale}
                            labels={{
                                read: dict.common.read,
                                featured: dict.common.featured,
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                        <QuickActions heading={dict.quickActions?.heading} />
                        <TrendingTags
                            initial={tags as any}
                            title={dict.trendingTags?.heading || "Trending tags"}
                            noTagsText={dict.trendingTags?.noTags || "No tags yet."}
                        />
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="grid gap-6 sm:gap-8">
                        <RecentPosts
                            featured={featured as any}
                            posts={recent as any}
                            maxTagsFeatured={Infinity}
                            maxTagsCard={6}
                            centerFeatured
                            locale={locale}
                            labels={{
                                read: dict.common.read,
                                featured: dict.common.featured,
                            }}
                        />
                        {popular.length > 0 && (
                            <div className="grid gap-3 sm:gap-4">
                                <h2 className="text-xl sm:text-2xl font-semibold">{dict.common.popular}</h2>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch auto-rows-fr">
                                    {popular.map((p) => (
                                        <Link
                                            key={p.id}
                                            href={`/blog/${p.slug}`}
                                            className="card card-hover p-3 sm:p-4 ring-1 ring-white/10 hover:ring-accent/50 h-full"
                                        >
                                            <div className="text-xs sm:text-sm text-accent mb-1">{dict.common.pick}</div>
                                            <div className="font-medium text-sm sm:text-base">{p.title}</div>
                                            <div className="text-dim text-xs sm:text-sm line-clamp-2">
                                                {p.description}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                        <QuickLinks />
                        <TrendingTags
                            initial={tags as any}
                            title={dict.trendingTags?.heading || "Trending tags"}
                            noTagsText={dict.trendingTags?.noTags || "No tags yet."}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
