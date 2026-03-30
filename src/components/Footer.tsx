import Link from "next/link";
import { getLocale, getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";

export default async function Footer() {
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    // Check if user is authenticated (simple check via cookie)
    const cookieStore = await cookies();
    const hasAuthCookie = cookieStore.has("auth_token");

    const d: any = dict || {};

    const tLatest: string =
        d.footer?.latest ?? d.common?.latest ?? "Latest";
    const tTopics: string =
        d.footer?.topics ?? d.common?.topics ?? "Topics";
    const tAdminLogin: string =
        d.footer?.adminLogin ?? "Admin Login";

    return (
        <footer className="mt-8 border-t border-white/10 relative">
            <div className="container-narrow py-3 text-[10px] text-dim flex items-center justify-between flex-wrap gap-2">
                <span>© {new Date().getFullYear()} AntotoPedia_12</span>
                <div className="flex gap-2 items-center">
                    <Link href="/blog" className="hover:text-accent">{tLatest}</Link>
                    <span>•</span>
                    <Link href="/tags" className="hover:text-accent">{tTopics}</Link>
                    {!hasAuthCookie && (
                        <>
                            <span>•</span>
                            <Link href="/login" className="hover:text-accent flex items-center gap-1">
                                <span>🔑</span>
                                {tAdminLogin}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
}
