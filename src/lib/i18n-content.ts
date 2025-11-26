import type { Locale } from "./i18n";

export function pickPostLocale<T extends {
    title?: string | null;
    description?: string | null;
    contentMarkdown?: string | null;
    i18n?: { locale: string; title: string; description?: string | null; contentMarkdown?: string | null }[];
}>(post: T, locale: Locale) {
    const row = post.i18n?.find(i => i.locale === locale);
    return {
        ...post,
        title: row?.title ?? post.title ?? "",
        description: row?.description ?? post.description ?? null,
        contentMarkdown: row?.contentMarkdown ?? post.contentMarkdown ?? "",
    };
}

export function pickTagLocale<T extends {
    name: string;
    i18n?: { locale: string; name: string }[];
}>(tag: T, locale: Locale) {
    const row = tag.i18n?.find(i => i.locale === locale);
    return { ...tag, name: row?.name ?? tag.name };
}
