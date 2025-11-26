import type { Locale } from "./i18n";

export function formatReadingTime(locale: Locale, minutes: number) {
    if (locale === "uk") return `${minutes} хв читання`;
    return `${minutes} min read`;
}
