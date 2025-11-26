"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function LanguageSwitcher({ initial }: { initial: "en" | "uk" }) {
    const router = useRouter();
    const [loc, setLoc] = useState<"en" | "uk">(initial);
    const [isPending, startTransition] = useTransition();

    const setLocale = (l: "en" | "uk") => {
        if (l === loc) return;
        startTransition(async () => {
            await fetch("/api/locale", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ locale: l }),
            });
            setLoc(l);
            router.refresh();
        });
    };

    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                className={`btn ${loc === "uk" ? "btn-primary" : "btn-ghost"} px-2 py-1 h-8`}
                onClick={() => setLocale("uk")}
                disabled={isPending}
            >
                UK
            </button>
            <button
                type="button"
                className={`btn ${loc === "en" ? "btn-primary" : "btn-ghost"} px-2 py-1 h-8`}
                onClick={() => setLocale("en")}
                disabled={isPending}
            >
                EN
            </button>
        </div>
    );
}
