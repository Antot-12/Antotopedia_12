"use client";

import Link from "next/link";

type Props = {
    id: number | null;
    slug: string;
    status: "draft" | "published";
    createdAt: Date | undefined;
    labels?: {
        postInfo?: string;
        id?: string;
        new?: string;
        status?: string;
        created?: string;
        viewPost?: string;
        draft?: string;
        published?: string;
    };
};

export default function PostMetadata({ id, slug, status, createdAt, labels }: Props) {

    const formatDate = (date: Date | undefined) => {
        if (!date) return '—';
        return new Date(date).toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <section className="card p-3 text-sm">
            <div className="font-medium mb-2">{labels?.postInfo || "Post Info"}</div>
            <ul className="grid gap-1 text-dim">
                <li>
                    <span className="font-semibold text-white/80 w-16 inline-block">{labels?.id || "ID"}:</span> {id ?? (labels?.new || "New")}
                </li>
                <li>
                    <span className="font-semibold text-white/80 w-16 inline-block">{labels?.status || "Status"}:</span>{" "}
                    <span className="capitalize">{status === "draft" ? (labels?.draft || "Draft") : (labels?.published || "Published")}</span>
                </li>
                <li>
                    <span className="font-semibold text-white/80 w-16 inline-block">{labels?.created || "Created"}:</span> {formatDate(createdAt)}
                </li>
            </ul>

            {id && status === "published" && (
                <div className="border-t border-white/10 pt-3 mt-3">
                    <Link
                        href={`/blog/${slug}`}
                        target="_blank"
                        className="btn btn-soft w-full h-8 text-sm px-2 flex justify-center items-center"
                    >
                        {labels?.viewPost || "View Post"}
                    </Link>
                </div>
            )}
        </section>
    );
}