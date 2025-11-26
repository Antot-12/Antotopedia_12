import { cookies, headers } from "next/headers";

export type Locale = "en" | "uk";
export const locales: Locale[] = ["en", "uk"];
export const defaultLocale: Locale = "en";

export async function getLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const c = cookieStore.get("lang")?.value as Locale | undefined;
    if (c && locales.includes(c)) return c;

    const hdrs = await headers();
    const acc = hdrs.get("accept-language") || "";
    const found = locales.find((l) => acc.toLowerCase().startsWith(l));
    return found || defaultLocale;
}

export async function getDictionary(locale: Locale) {
    if (locale === "uk") {
        const m = await import("@/i18n/uk");
        return m.dict;
    }
    const m = await import("@/i18n/en");
    return m.dict;
}
