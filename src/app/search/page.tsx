import AdvancedSearch from "@/components/AdvancedSearch";

export const metadata = {
  title: "Search - AntotoPedia_12",
  description: "Search posts and content",
};

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Search</h1>
        <p className="text-white/70">Find posts, tags, and content across the blog</p>
      </div>
      <AdvancedSearch />
    </div>
  );
}
