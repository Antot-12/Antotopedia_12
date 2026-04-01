import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeExternalLinks from "rehype-external-links";
import { defaultSchema } from "hast-util-sanitize";
import type { Prisma } from "@prisma/client";
import ReadingProgress from "@/components/ReadingProgress";
import ShareBar from "@/components/ShareBar";
import LikeButton from "@/components/LikeButton";
import CodeBlock from "@/components/md/CodeBlock";
import PostCard from "@/components/PostCard";
import OnThisPage from "@/components/OnThisPage";
import ReactionsBar from "@/components/ReactionsBar";
import { getLocale, getDictionary } from "@/lib/i18n";
import StickyWrapper from "@/components/StickyWrapper";
import type { Locale } from "@/lib/i18n";
import PostLangSwitcher from "@/components/PostLangSwitcher";
import { calculateReadingTime } from "@/lib/reading-time";

export const revalidate = 0;

type Params = { slug: string };
type Search = { lang?: string };
type Props = { params: Promise<Params>; searchParams: Promise<Search> };

type PostWithAll = Prisma.PostGetPayload<{
    include: {
        tags: true;
        reaction: true;
        i18n: true;
    };
}>;

function readingTime(text?: string | null) {
    return calculateReadingTime(text);
}

const colorStyleRegex = /^color\s*:\s*([#a-zA-Z0-9()\s.,%-]+)\s*;?$/;

const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...(defaultSchema as any).attributes,
        span: [
            ...((((defaultSchema as any).attributes || {})?.span) || []),
            ["style", colorStyleRegex],
        ],
        code: [
            ...((((defaultSchema as any).attributes || {})?.code) || []),
            ["className", /^language-[\w-]+$/],
        ],
        img: [
            ...((((defaultSchema as any).attributes || {})?.img) || []),
            ["title", ".*"],
            ["src", ".*"],
            ["alt", ".*"],
        ],
        a: [
            ...((((defaultSchema as any).attributes || {})?.a) || []),
            ["target", /^_blank$/],
            [
                "rel",
                /^(noopener|noreferrer|nofollow)(\s+(noopener|noreferrer|nofollow))*$/,
            ],
        ],
    },
    tagNames: [...(((defaultSchema as any).tagNames) || []), "span"],
};

function slugifyHeading(s: string) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, "") // Keep Unicode letters, numbers, spaces, and dashes
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

function extractToc(md?: string | null) {
    const lines = (md || "").split("\n");
    const items: { id: string; text: string; level: 2 | 3; readingTime?: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const m2 = /^##\s+(.+)$/.exec(line);
        const m3 = /^###\s+(.+)$/.exec(line);

        if (m2 || m3) {
            const text = (m2 || m3)![1].trim();
            const level = m2 ? 2 : 3;

            // Calculate content until next heading
            let content = "";
            for (let j = i + 1; j < lines.length; j++) {
                if (/^#{2,3}\s+/.test(lines[j])) break;
                content += lines[j] + " ";
            }

            // Calculate reading time: 200 words per minute
            const words = content.trim().split(/\s+/).filter(Boolean).length;
            const readingTime = Math.max(10, Math.ceil((words / 200) * 60)); // minimum 10 seconds

            items.push({
                id: slugifyHeading(text),
                text: text,
                level: level as 2 | 3,
                readingTime: readingTime,
            });
        }
    }
    return items.slice(0, 30);
}

function normalizeCloudinarySrc(src: string) {
    if (!src || !src.startsWith("http")) return src;
    if (!/res\.cloudinary\.com/.test(src)) return src;
    const marker = "/upload/";
    const idx = src.indexOf(marker);
    if (idx === -1) return src;
    const after = src.slice(idx + marker.length);
    if (
        after.startsWith("f_auto") ||
        after.startsWith("q_auto") ||
        after.startsWith("w_")
    ) {
        return src;
    }
    return src.slice(0, idx + marker.length) + "f_auto,q_auto,w_1280/" + after;
}

function applyLocale(post: PostWithAll, locale: Locale) {
    const row = post.i18n?.find((i) => i.locale === locale);
    return {
        ...post,
        title: row?.title ?? post.title ?? "",
        description: row?.description ?? post.description ?? "",
        contentMarkdown: row?.contentMarkdown ?? post.contentMarkdown ?? "",
    };
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getLocale();
    if (!slug || typeof slug !== "string") return {};
    try {
        const post = await prisma.post.findFirst({
            where: { slug, status: "published" },
            include: { i18n: true },
        });
        if (!post) return {};
        const view = applyLocale(post as any, locale);
        return {
            title: view.title,
            description: view.description || undefined,
        };
    } catch {
        return {};
    }
}

export default async function PostPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const search = await searchParams;

    const queryLang = String(search?.lang || "").toLowerCase();
    const fallbackLocale = await getLocale();
    const locale: Locale =
        queryLang === "uk" || queryLang === "en"
            ? (queryLang as Locale)
            : fallbackLocale;

    const dict = await getDictionary(locale);

    if (!slug || typeof slug !== "string") notFound();

    let post: PostWithAll | null = null;
    try {
        post = (await prisma.post.findFirst({
            where: { slug },
            include: {
                tags: true,
                reaction: true,
                i18n: true,
            },
        })) as PostWithAll | null;
    } catch {
        post = null;
    }
    if (!post || post.status === "draft") notFound();

    const view = applyLocale(post, locale);
    const title = view.title;
    const description = view.description ?? "";
    const content = view.contentMarkdown ?? "";

    const created = post.createdAt
        ? new Date(post.createdAt as any).toLocaleDateString(
            locale === "uk" ? "uk-UA" : "en-US"
        )
        : undefined;
    const updated = post.updatedAt
        ? new Date(post.updatedAt as any).toLocaleDateString(
            locale === "uk" ? "uk-UA" : "en-US"
        )
        : undefined;
    const showUpdated = updated && updated !== created;
    const meta = readingTime(`${title} ${description} ${content}`);
    const cover = post.coverImageUrl || "/no_image.jpg";
    const toc = extractToc(content);
    const tagSlugs = post.tags.map((x) => x.slug || x.name);
    const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/blog/${post.slug}?lang=${locale}`;

    let prev: PostWithAll | null = null;
    let next: PostWithAll | null = null;
    let related: PostWithAll[] = [];
    try {
        prev = (await prisma.post.findFirst({
            where: { status: "published", createdAt: { lt: post.createdAt } },
            orderBy: { createdAt: "desc" },
            include: {
                tags: true,
                reaction: true,
                i18n: true,
            },
        })) as any;

        next = (await prisma.post.findFirst({
            where: { status: "published", createdAt: { gt: post.createdAt } },
            orderBy: { createdAt: "asc" },
            include: {
                tags: true,
                reaction: true,
                i18n: true,
            },
        })) as any;

        if (tagSlugs.length) {
            related = (await prisma.post.findMany({
                where: {
                    status: "published",
                    id: { not: post.id },
                    tags: { some: { slug: { in: tagSlugs } } },
                },
                orderBy: { createdAt: "desc" },
                take: 6,
                include: {
                    tags: true,
                    reaction: true,
                    i18n: true,
                },
            })) as any;
        }
    } catch {
        related = [];
    }

    const tPosts = dict.posts;

    return (
        <article className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
            <ReadingProgress />

            <div className="grid gap-6">
                <div className="card p-0 overflow-hidden w-full">
                    <div className="relative w-full max-h-[360px] overflow-hidden">
                        <div className="relative w-full" style={{ aspectRatio: "16 / 6" }}>
                            <Image
                                src={cover}
                                alt={title || "Cover"}
                                fill
                                className="object-cover max-h-[420px]"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1600px) 1200px, 1600px"
                            />
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="p-6 md:p-8 grid gap-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex flex-col gap-2 min-w-0">
                                <h1 className="text-3xl md:text-4xl font-semibold leading-tight break-words">
                                    {title}
                                </h1>
                                <PostLangSwitcher current={locale} slug={post.slug} />
                            </div>
                            <LikeButton slug={post.slug} />
                        </div>

                        {description ? <p className="text-dim">{description}</p> : null}

                        <div className="flex flex-wrap items-center gap-2 text-sm text-dim">
                            {created ? <span>{created}</span> : null}
                            {showUpdated ? (
                                <>
                                    <span>•</span>
                                    <span>
                    {locale === "uk" ? "Оновлено" : "Updated"} {updated}
                  </span>
                                </>
                            ) : null}
                            <span>•</span>
                            <span>
                {locale === "uk"
                    ? meta.replace("min read", "хв читання")
                    : meta}
              </span>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tg) => (
                                    <Link
                                        key={tg.id}
                                        href={`/tags/${tg.slug ?? tg.name}`}
                                        className="chip text-xs hover:border-accent hover:text-accent"
                                    >
                                        #{tg.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <ReactionsBar
                            postId={post.id}
                            initial={post.reaction || undefined}
                            labels={{
                                total: dict.reactions?.total,
                                like: dict.reactions?.like,
                                love: dict.reactions?.love,
                                wow: dict.reactions?.wow,
                                fire: dict.reactions?.fire,
                            }}
                        />
                    </div>
                </div>

                <div className="card p-6 w-full">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[
                            rehypeRaw,
                            [rehypeSanitize, sanitizeSchema as any],
                            [
                                rehypeExternalLinks,
                                {
                                    target: "_blank",
                                    rel: ["nofollow", "noopener", "noreferrer"],
                                },
                            ],
                        ]}
                        className="prose prose-invert max-w-none"
                        components={{
                            h2(props: any) {
                                const text = String(props.children ?? "");
                                const id = slugifyHeading(text);
                                return <h2 id={id} {...props} />;
                            },
                            h3(props: any) {
                                const text = String(props.children ?? "");
                                const id = slugifyHeading(text);
                                return <h3 id={id} {...props} />;
                            },
                            p({ node, children, ...rest }: any) {
                                const onlyChild = node?.children?.[0];
                                if (
                                    node?.children?.length === 1 &&
                                    onlyChild &&
                                    (onlyChild.type === "element" || onlyChild.tagName === "img")
                                ) {
                                    return (
                                        <p className="my-4 flex justify-center" {...rest}>
                                            {children}
                                        </p>
                                    );
                                }
                                return <p {...rest}>{children}</p>;
                            },
                            code({ inline, children, className, ...rest }: any) {
                                if (inline)
                                    return (
                                        <code
                                            className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10"
                                            {...rest}
                                        >
                                            {children}
                                        </code>
                                    );
                                return <code className={className}>{children}</code>;
                            },
                            pre({ children }: any) {
                                const child: any = Array.isArray(children) ? children[0] : children;
                                const raw = child?.props?.children;
                                const codeText =
                                    typeof raw === "string"
                                        ? raw
                                        : String((Array.isArray(raw) ? raw[0] : raw) ?? "");
                                const cls = (child?.props?.className as string) || "";
                                const lang = cls.replace("language-", "") || undefined;
                                return <CodeBlock code={codeText} language={lang} />;
                            },
                            img(props: any) {
                                const safeSrc = normalizeCloudinarySrc(props.src || "");
                                return (
                                    <img
                                        {...props}
                                        src={safeSrc}
                                        className="rounded-xl border border-white/10 max-w-full h-auto max-h-[480px] mx-auto block"
                                        alt={props.alt ?? ""}
                                        loading="lazy"
                                    />
                                );
                            },
                            a(props: any) {
                                return (
                                    <a
                                        {...props}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-accent underline"
                                    />
                                );
                            },
                        }}
                    >
                        {String(content)}
                    </ReactMarkdown>
                </div>

                {(prev || next) && (
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        {prev ? (
                            <Link
                                href={`/blog/${prev.slug}?lang=${locale}`}
                                className="card card-hover p-4"
                            >
                                <div className="text-dim text-xs mb-1">
                                    {locale === "uk" ? "Попередній пост" : "Previous post"}
                                </div>
                                <div className="font-medium line-clamp-2">
                                    {applyLocale(prev, locale).title}
                                </div>
                            </Link>
                        ) : (
                            <div className="hidden md:block" />
                        )}
                        {next ? (
                            <Link
                                href={`/blog/${next.slug}?lang=${locale}`}
                                className="card card-hover p-4 text-right"
                            >
                                <div className="text-dim text-xs mb-1">
                                    {locale === "uk" ? "Наступний пост" : "Next post"}
                                </div>
                                <div className="font-medium line-clamp-2">
                                    {applyLocale(next, locale).title}
                                </div>
                            </Link>
                        ) : (
                            <div className="hidden md:block" />
                        )}
                    </div>
                )}

                {related.length > 0 && (
                    <section className="grid gap-3 w-full">
                        <h3 className="text-lg font-semibold">
                            {tPosts?.related ?? (locale === "uk" ? "Схожі пости" : "Related posts")}
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {related.map((p) => {
                                const v = applyLocale(p, locale);
                                return <PostCard key={p.id} post={v as any} />;
                            })}
                        </div>
                    </section>
                )}

                <div className="w-full">
                    <Link href="/blog" className="btn btn-soft">
                        {locale === "uk" ? "Назад до списку" : "Back to list"}
                    </Link>
                </div>

                {/* Mobile Share Section */}
                <div className="lg:hidden w-full">
                    <ShareBar
                        url={pageUrl}
                        title={title}
                        labels={{
                            heading: dict.shareBar?.heading,
                            copyLink: dict.shareBar?.copyLink,
                            copied: dict.shareBar?.copied,
                            linkCopiedClipboard: dict.shareBar?.linkCopiedClipboard,
                            failedCopy: dict.shareBar?.failedCopy,
                            sharedSuccessfully: dict.shareBar?.sharedSuccessfully,
                            shareFailed: dict.shareBar?.shareFailed,
                            share: dict.shareBar?.share,
                            email: dict.shareBar?.email,
                            scanQRCode: dict.shareBar?.scanQRCode,
                            scanWithPhone: dict.shareBar?.scanWithPhone,
                            showQRCode: dict.shareBar?.showQRCode,
                            close: dict.shareBar?.close,
                        }}
                    />
                </div>
            </div>

            {/* Mobile FAB & Drawer only (OnThisPage handles mobile internally) */}
            <div className="lg:hidden">
                <OnThisPage
                    items={toc}
                    baseUrl={pageUrl}
                    labels={{
                        heading: dict.onThisPage?.heading,
                        hide: dict.onThisPage?.hide,
                        show: dict.onThisPage?.show,
                        noSections: dict.onThisPage?.noSections,
                        backToTop: dict.onThisPage?.backToTop,
                        progress: dict.onThisPage?.progress,
                        readingTime: dict.onThisPage?.readingTime,
                        minRead: dict.onThisPage?.minRead,
                        secRead: dict.onThisPage?.secRead,
                        of: dict.onThisPage?.of,
                        sections: dict.onThisPage?.sections,
                    }}
                />
            </div>

            {/* Desktop Sidebar with both OnThisPage and ShareBar */}
            <aside className="hidden lg:flex flex-col gap-4">
                <StickyWrapper>
                    <OnThisPage
                        items={toc}
                        baseUrl={pageUrl}
                        labels={{
                            heading: dict.onThisPage?.heading,
                            hide: dict.onThisPage?.hide,
                            show: dict.onThisPage?.show,
                            noSections: dict.onThisPage?.noSections,
                            backToTop: dict.onThisPage?.backToTop,
                            progress: dict.onThisPage?.progress,
                            readingTime: dict.onThisPage?.readingTime,
                            minRead: dict.onThisPage?.minRead,
                            secRead: dict.onThisPage?.secRead,
                            of: dict.onThisPage?.of,
                            sections: dict.onThisPage?.sections,
                        }}
                    />
                </StickyWrapper>
                <ShareBar
                            url={pageUrl}
                            title={title}
                            labels={{
                        heading: dict.shareBar?.heading,
                        copyLink: dict.shareBar?.copyLink,
                        copied: dict.shareBar?.copied,
                        linkCopiedClipboard: dict.shareBar?.linkCopiedClipboard,
                        failedCopy: dict.shareBar?.failedCopy,
                        sharedSuccessfully: dict.shareBar?.sharedSuccessfully,
                        shareFailed: dict.shareBar?.shareFailed,
                        share: dict.shareBar?.share,
                        email: dict.shareBar?.email,
                        scanQRCode: dict.shareBar?.scanQRCode,
                        scanWithPhone: dict.shareBar?.scanWithPhone,
                        showQRCode: dict.shareBar?.showQRCode,
                        close: dict.shareBar?.close,
                    }}
                />
            </aside>
        </article>
    );
}
