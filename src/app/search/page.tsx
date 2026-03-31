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
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{dict.common.search}</h1>
        <p className="text-white/70">{dict.search?.subtitle || "Find posts, tags, and content across the blog"}</p>
      </div>
      <AdvancedSearch
        labels={{
          placeholder: dict.search?.placeholder,
          filters: dict.search?.filters,
          advancedFilters: dict.search?.advancedFilters,
          clearFilters: dict.search?.clearFilters,
          filterByTags: dict.search?.filterByTags,
          fromDate: dict.search?.fromDate,
          toDate: dict.search?.toDate,
          sortBy: dict.search?.sortBy,
          relevance: dict.search?.relevance,
          dateDesc: dict.search?.dateDesc,
          dateAsc: dict.search?.dateAsc,
          titleAsc: dict.search?.titleAsc,
          didYouMean: dict.search?.didYouMean,
          noResultsTitle: dict.search?.noResultsTitle,
          noResultsText: dict.search?.noResultsText,
        }}
      />
    </div>
  );
}
