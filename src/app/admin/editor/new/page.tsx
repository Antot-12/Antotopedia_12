import Editor from "@/components/editor/Editor";
import { getLocale, getDictionary } from "@/lib/i18n";

export default async function NewPostPage() {
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    return (
        <div className="grid gap-4">
            <h1 className="text-2xl font-semibold">{dict.admin.createPost}</h1>
            <Editor
                initial={{
                    id: null,
                    title: "",
                    slug: "",
                    description: "",
                    contentMarkdown: "",
                    coverImageUrl: "",
                    coverImagePublicId: "",
                    status: "draft",
                    tags: [],
                    i18n: [],
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
                }}
            />
        </div>
    );
}
