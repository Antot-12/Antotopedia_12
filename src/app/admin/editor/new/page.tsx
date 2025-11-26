import Editor from "@/components/editor/Editor";

export default function NewPostPage() {
    return (
        <div className="grid gap-4">
            <h1 className="text-2xl font-semibold">Create post</h1>
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
            />
        </div>
    );
}
