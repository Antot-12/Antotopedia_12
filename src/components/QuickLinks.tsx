import Link from "next/link";

export default function QuickLinks() {
    return (
        <aside className="grid gap-4">
            <div className="card p-5 grid gap-4">
                <h2 className="text-xl font-semibold">Quick links</h2>

                <form action="/blog" className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <input name="q" placeholder="Search posts..." className="input" />
                    <button className="btn btn-primary">Search</button>
                </form>

                <div className="grid gap-2">
                    <Link href="/blog" className="btn btn-soft">Latest posts</Link>
                    <Link href="/tags" className="btn btn-soft">All tags</Link>
                    <Link href="/blog?q=guide" className="btn btn-soft">Guides</Link>
                    <Link href="/blog?q=tips" className="btn btn-soft">Tips</Link>
                </div>
            </div>
        </aside>
    );
}
