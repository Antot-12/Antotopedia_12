"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n";

type Props = {
    current: Locale;
    slug: string;
};

export default function PostLangSwitcher({ current, slug }: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const go = (lang: Locale) => {
        if (lang === current || pending) return;
        document.cookie = `lang=${lang}; path=/; max-age=31536000`;
        startTransition(() => {
            if (typeof window !== "undefined") {
                const sp = new URLSearchParams(window.location.search);
                sp.set("lang", lang);
                const href = `/blog/${slug}?${sp.toString()}`;
                router.replace(href);
            } else {
                router.replace(`/blog/${slug}?lang=${lang}`);
            }
        });
    };

    const baseCls =
        "h-8 px-3 rounded-full text-xs font-medium border transition inline-flex items-center justify-center min-w-[3rem]";
    const activeCls = "bg-accent text-black border-accent";
    const idleCls = "border-white/20 text-white/70 hover:border-accent/60 hover:text-accent";

    const label = current === "uk" ? "Мова" : "Language";

    return (
        <div className="flex items-center gap-2 text-xs text-dim">
            <span>{label}:</span>
            <div className="inline-flex gap-1 bg-black/40 rounded-full p-1 border border-white/10">
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => go("uk")}
                    className={`${baseCls} ${current === "uk" ? activeCls : idleCls}`}
                >
                    UK
                </button>
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => go("en")}
                    className={`${baseCls} ${current === "en" ? activeCls : idleCls}`}
                >
                    EN
                </button>
            </div>
        </div>
    );
}
