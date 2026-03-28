import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function Navbar() {
    const user = await getCurrentUser();
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    return (
        <div className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className="container-narrow h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
                <Link href="/" className="text-base sm:text-xl font-semibold tracking-tight text-accent flex-shrink-0">
                    {dict.nav.brand}
                </Link>

                <form action="/blog" className="hidden lg:flex items-center gap-2 flex-1 max-w-md">
                    <input name="q" placeholder={dict.nav.search_placeholder} className="input w-full" />
                    <button className="btn btn-primary whitespace-nowrap">{dict.nav.search}</button>
                </form>

                <nav className="flex items-center gap-1 sm:gap-2">
                    <Link href="/blog" className="btn btn-soft text-xs sm:text-sm px-2 sm:px-4">{dict.nav.blog}</Link>
                    <Link href="/tags" className="btn btn-soft text-xs sm:text-sm px-2 sm:px-4">{dict.nav.tags}</Link>
                    {user ? (
                        <>
                            <Link href="/admin" className="btn btn-primary text-xs sm:text-sm px-2 sm:px-4">{dict.nav.admin}</Link>
                            <form action="/api/auth/logout" method="post">
                                <button className="btn btn-ghost text-xs sm:text-sm px-2 sm:px-4">Logout</button>
                            </form>
                        </>
                    ) : (
                        <Link href="/login" aria-label={dict.nav.login_aria} title={dict.nav.login_aria} className="btn btn-ghost w-10 h-10 p-0 text-base sm:text-lg">🔑</Link>
                    )}
                    <LanguageSwitcher initial={locale} />
                </nav>
            </div>

            {/* Mobile Search Bar */}
            <div className="lg:hidden border-t border-white/5 px-4 py-2">
                <form action="/blog" className="flex items-center gap-2">
                    <input name="q" placeholder={dict.nav.search_placeholder} className="input w-full text-sm" />
                    <button className="btn btn-primary text-sm whitespace-nowrap">{dict.nav.search}</button>
                </form>
            </div>
        </div>
    );
}
