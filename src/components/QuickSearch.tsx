import { getDictionary, getLocale } from "@/lib/i18n";

export default async function QuickSearch() {
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    return (
        <section className="card p-4">
            <form action="/blog" method="get" className="flex gap-2">
                <input
                    name="q"
                    className="input flex-1"
                    placeholder={dict.nav.search_placeholder}
                />
                <button type="submit" className="btn btn-primary">{dict.nav.search}</button>
            </form>
        </section>
    );
}
