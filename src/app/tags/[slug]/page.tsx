import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

// Мінімальний тип поста, який очікує PostCard
type PostLike = {
    id: number | string;
    slug: string;
    title: string;
    description?: string | null;
    coverImageUrl?: string | null;
    createdAt?: Date | string | null;
    tags?: { name: string }[];
};

export default async function TagPosts(props: PageProps) {
    const { slug } = await props.params;

    const tag = await prisma.tag.findUnique({
        where: { slug },
        include: {
            posts: {
                where: { status: "published" },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    description: true,
                    coverImageUrl: true,
                    createdAt: true,
                    tags: { select: { name: true } },
                },
            },
        },
    });

    if (!tag) notFound();

    return (
        <div className="grid gap-4">
            <h1 className="text-3xl font-semibold">#{tag.name}</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tag.posts.map((p: PostLike) => (
                    <PostCard key={p.id} post={p} />
                ))}
            </div>
        </div>
    );
}
