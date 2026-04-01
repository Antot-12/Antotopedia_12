import { prisma } from "@/lib/prisma";
import Editor from "@/components/editor/Editor";
import { getLocale, getDictionary } from "@/lib/i18n";

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const idNum = Number(id);
    const locale = await getLocale();
    const dict = await getDictionary(locale);

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
        <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-6 lg:px-8 grid gap-4">
            <h1 className="text-2xl font-semibold">{dict.admin.editPost}</h1>
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
                labels={{
                    statusLabel: dict.admin.statusLabel,
                    draft: dict.admin.draft,
                    published: dict.admin.published,
                    save: dict.admin.save,
                    saving: dict.admin.saving,
                    update: dict.admin.update,
                    publish: dict.admin.publish,
                    deletePost: dict.admin.deletePost,
                    saveAndPublish: dict.admin.saveAndPublish,
                    allChangesSaved: dict.admin.allChangesSaved,
                    unsavedChanges: dict.admin.unsavedChanges,
                    postInfo: dict.admin.postInfo,
                    id: dict.admin.id,
                    new: dict.admin.new,
                    status: dict.admin.status,
                    created: dict.admin.created,
                    viewPost: dict.admin.viewPost,
                    wordCount: dict.admin.wordCount,
                    readingTime: dict.admin.readingTime,
                    copyUrl: dict.admin.copyUrl,
                    copied: dict.admin.copied,
                    errors: dict.editor.errors,
                }}
            />
        </div>
    );
}
