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
            />
        </div>
    );
}
