import Link from "next/link";

export default function TagChip({ slug, name }: { slug: string; name: string }) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="px-3 py-1 rounded-full border border-white/15 text-xs hover:border-neon hover:text-neon transition"
    >
      #{name}
    </Link>
  );
}
