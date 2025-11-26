"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

type Tag = { name: string; slug?: string | null };
type Post = {
    id: number | string;
    slug?: string | null;
    title?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    createdAt?: string | Date | null;
    tags?: Tag[] | null;
};

function readingTime(text?: string | null) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    const min = Math.max(1, Math.round(words / 200));
    return `${min} min read`;
}

export default function PostCard({
                                     post,
                                     featured = false,
                                     infoCentered = true,
                                     maxTags = 4,
                                     bordered = true,
                                     // додатково: можна передати локаль та лейбли, але це не обов’язково
                                     locale,
                                     labels,
                                 }: {
    post: Post | undefined;
    featured?: boolean;
    infoCentered?: boolean;
    maxTags?: number;
    bordered?: boolean;
    locale?: "en" | "uk";
    labels?: { read?: string; featured?: string };
}) {
    const router = useRouter();
    if (!post || !post.slug || !post.title) return null;

    const href = `/blog/${post.slug}`;
    const metaBase = readingTime(`${post.title} ${post.description || ""}`);
    const meta =
        locale === "uk"
            ? metaBase.replace("min read", "хв читання")
            : metaBase;

    const created = post.createdAt ? new Date(post.createdAt as any).toLocaleDateString() : undefined;
    const imgSrc = post.coverImageUrl || "/no_image.jpg";
    const ringCls = bordered ? "ring-1 ring-white/10 hover:ring-accent/50" : "";
    const goToPost = () => router.push(href);
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToPost();
        }
    };

    const t = {
        read: labels?.read ?? "Read",
        featured: labels?.featured ?? "Featured",
    };

    return (
        <article
            role="link"
            tabIndex={0}
            aria-label={post.title}
            onClick={goToPost}
            onKeyDown={onKey}
            className={`card card-hover overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full flex flex-col ${ringCls}`}
        >
            <div className="relative aspect-[16/9] w-full">
                <Image
                    src={imgSrc}
                    alt={post.title || "Post"}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 560px, 100vw"
                    priority={featured}
                />
                {featured && <div className="absolute left-4 top-4 chip px-2.5 py-0.5 text-xs">{t.featured}</div>}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className={featured ? "p-5 md:p-6 flex flex-col grow" : "p-4 flex flex-col grow"}>
                <div className={["font-semibold leading-snug", featured ? "text-2xl md:text-3xl" : "text-lg", infoCentered ? "text-center" : ""].join(" ")}>
                    {post.title}
                </div>

                {post.description ? (
                    <div className={["text-dim mt-1 line-clamp-2", infoCentered ? "text-center" : ""].join(" ")}>{post.description}</div>
                ) : null}

                <div className={["mt-3 flex flex-wrap items-center gap-2 text-sm text-dim", infoCentered ? "justify-center" : ""].join(" ")}>
                    {created ? <span>{created}</span> : null}
                    <span>•</span>
                    <span>{meta}</span>
                </div>

                {post.tags && post.tags.length ? (
                    <div className={["mt-3 flex flex-wrap gap-2", infoCentered ? "justify-center" : ""].join(" ")}>
                        {(maxTags === Infinity ? post.tags : post.tags.slice(0, maxTags)).map((t, i) => (
                            <button
                                key={`${t.slug ?? t.name}-${i}`}
                                type="button"
                                className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 text-accent text-sm px-3 py-1 hover:border-accent hover:bg-accent/15"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/tags/${t.slug ?? t.name}`);
                                }}
                            >
                                #{t.name}
                            </button>
                        ))}
                        {maxTags !== Infinity && post.tags.length > maxTags ? (
                            <span className="text-xs text-dim">+{post.tags.length - maxTags}</span>
                        ) : null}
                    </div>
                ) : null}

                <div className={["mt-5", infoCentered ? "text-center" : ""].join(" ")}>
                    <button
                        type="button"
                        aria-label="Read post"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPost();
                        }}
                        className="inline-flex items-center justify-center rounded-2xl bg-accent text-black font-semibold h-12 px-8 md:h-14 md:px-10 text-base md:text-lg shadow-[0_10px_30px_-10px_rgba(46,231,216,.5)] hover:shadow-[0_18px_36px_-12px_rgba(46,231,216,.65)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent/60"
                    >
                        {t.read}
                    </button>
                </div>
            </div>
        </article>
    );
}
