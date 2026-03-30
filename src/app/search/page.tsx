import AdvancedSearch from "@/components/AdvancedSearch";
import { getLocale, getDictionary } from "@/lib/i18n";

export const metadata = {
  title: "Search - AntotoPedia_12",
  description: "Search posts and content",
};

export default async function SearchPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{dict.common.search}</h1>
        <p className="text-white/70">
          {locale === "uk"
            ? "Знайдіть пости, теги та контент у блозі"
            : "Find posts, tags, and content across the blog"}
        </p>
      </div>
      <AdvancedSearch />
    </div>
  );
}
