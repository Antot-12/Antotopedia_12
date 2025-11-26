import PostCard from "./PostCard";

type PostListItem = {
    id: number | string;
    slug: string;
    title: string;
    description: string | null;
    coverImageUrl: string | null;
    createdAt?: string | Date | null;
    tags?: { name: string; slug?: string }[];
};

export default function RecentPosts({
                                        featured,
                                        posts,
                                        maxTagsFeatured = Infinity,
                                        maxTagsCard = 6,
                                        centerFeatured = true,
                                        // додатково: можна передати локаль і лейбли на картки (необов’язково)
                                        locale,
                                        labels,
                                    }: {
    featured?: PostListItem;
    posts: PostListItem[];
    maxTagsFeatured?: number;
    maxTagsCard?: number;
    centerFeatured?: boolean;
    locale?: "en" | "uk";
    labels?: { read?: string; featured?: string };
}) {
    const ordered = featured
        ? [featured, ...posts.filter((p) => p.id !== featured.id)]
        : posts;

    return (
        <section className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                {ordered.map((p) => (
                    <PostCard
                        key={p.id}
                        post={p}
                        bordered
                        infoCentered={true}
                        maxTags={featured && p.id === featured.id ? maxTagsFeatured : maxTagsCard}
                        locale={locale}
                        labels={labels}
                    />
                ))}
            </div>
        </section>
    );
}
