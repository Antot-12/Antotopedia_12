import Link from "next/link";
import { getLocale, getDictionary } from "@/lib/i18n";

export default async function Footer() {
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    const d: any = dict || {};

    const tLatest: string =
        d.footer?.latest ?? d.common?.latest ?? "Latest";
    const tTopics: string =
        d.footer?.topics ?? d.common?.topics ?? "Topics";

    return (
        <footer className="mt-16 border-t border-white/10">
            <div className="container-narrow py-4 text-xs text-dim flex items-center justify-between">
                <span>© {new Date().getFullYear()} AntotoPedia_12</span>
                <div className="flex gap-3">
                    <Link href="/blog" className="hover:text-accent">{tLatest}</Link>
                    <Link href="/tags" className="hover:text-accent">{tTopics}</Link>
                </div>
            </div>
        </footer>
    );
}
