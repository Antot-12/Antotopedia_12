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
    const lowerAcc = acc.toLowerCase();

    // Check for Ukrainian-related languages (Ukrainian, Russian, Belarusian)
    if (lowerAcc.includes("uk") || lowerAcc.includes("ru") || lowerAcc.includes("be")) {
        return "uk";
    }

    // English and Slovak use English, as well as all other languages
    return "en";
}

export async function getDictionary(locale: Locale) {
    if (locale === "uk") {
        const m = await import("@/i18n/uk");
        return m.dict;
    }
    const m = await import("@/i18n/en");
    return m.dict;
}
