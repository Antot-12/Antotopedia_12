import { prisma } from "@/lib/prisma";
import Editor from "@/components/editor/Editor";

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const idNum = Number(id);

    const post =
        prisma && (prisma as any).post?.findUnique
            ? await prisma.post.findUnique({
                where: { id: idNum },
                include: { tags: true, i18n: true },
            })
            : {
                id: idNum,
                slug: "demo-post",
                title: "Demo Post",
                description: "This is a demo post (no DB connected)",
                contentMarkdown: "# Demo Post\nNo database connected.",
                coverImageUrl: null,
                coverImagePublicId: null,
                status: "draft" as const,
                createdAt: new Date(),
                tags: [{ name: "demo" }],
                i18n: [],
            };

    return (
        <div className="grid gap-4">
            <h1 className="text-2xl font-semibold">Edit post</h1>
            <Editor
                initial={{
                    id: post?.id ?? null,
                    title: post?.title ?? "",
                    slug: post?.slug ?? "",
                    description: post?.description ?? "",
                    contentMarkdown: (post as any)?.contentMarkdown ?? "",
                    coverImageUrl: (post as any)?.coverImageUrl ?? "",
                    coverImagePublicId: (post as any)?.coverImagePublicId ?? "",
                    status: (post as any)?.status ?? "draft",
                    tags: (post as any)?.tags?.map((t: { name: string }) => t.name) ?? [],
                    createdAt: (post as any)?.createdAt,
                    i18n: (post as any)?.i18n ?? [],
                }}
            />
        </div>
    );
}
