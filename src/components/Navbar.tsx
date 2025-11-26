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
            <div className="container-narrow h-16 flex items-center justify-between gap-4">
                <Link href="/" className="text-xl font-semibold tracking-tight text-accent">
                    {dict.nav.brand}
                </Link>

                <form action="/blog" className="hidden md:flex items-center gap-2">
                    <input name="q" placeholder={dict.nav.search_placeholder} className="input w-64" />
                    <button className="btn btn-primary">{dict.nav.search}</button>
                </form>

                <nav className="flex items-center gap-2">
                    <Link href="/blog" className="btn btn-soft">{dict.nav.blog}</Link>
                    <Link href="/tags" className="btn btn-soft">{dict.nav.tags}</Link>
                    {user ? (
                        <>
                            <Link href="/admin" className="btn btn-primary">{dict.nav.admin}</Link>
                            <form action="/api/auth/logout" method="post">
                                <button className="btn btn-ghost">Logout</button>
                            </form>
                        </>
                    ) : (
                        <Link href="/login" aria-label={dict.nav.login_aria} title={dict.nav.login_aria} className="btn btn-ghost w-10 h-10 p-0 text-lg">🔑</Link>
                    )}
                    <LanguageSwitcher initial={locale} />
                </nav>
            </div>
        </div>
    );
}
