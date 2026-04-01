// Shared utility functions for post processing

/**
 * Calculate reading time based on word count
 * @param text - Text to analyze (title, description, content combined)
 * @returns Reading time string in format "X min read"
 */
export function calculateReadingTime(text?: string | null): string {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    const min = Math.max(1, Math.round(words / 200));
    return `${min} min read`;
}

/**
 * Count total words in a post
 */
export function countWords(text?: string | null): number {
    return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Format reading time based on locale
 */
export function formatReadingTime(minutes: number, locale: "en" | "uk"): string {
    if (locale === "uk") {
        return `${minutes} хв читання`;
    }
    return `${minutes} min read`;
}
