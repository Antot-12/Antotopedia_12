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
        <footer className="mt-8 border-t border-white/10 relative">
            <div className="container-narrow py-3 text-[10px] text-dim flex items-center justify-between flex-wrap gap-2">
                <span>© {new Date().getFullYear()} AntotoPedia_12</span>
                <div className="flex gap-2">
                    <Link href="/blog" className="hover:text-accent">{tLatest}</Link>
                    <Link href="/tags" className="hover:text-accent">{tTopics}</Link>
                </div>
            </div>
        </footer>
    );
}
