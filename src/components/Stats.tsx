export default function Stats({ posts, tags, views }: { posts: number; tags: number; views: number }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="card p-6 text-center">
        <div className="text-3xl font-semibold">{posts}</div>
        <div className="text-dim">Published posts</div>
      </div>
      <div className="card p-6 text-center">
        <div className="text-3xl font-semibold">{tags}</div>
        <div className="text-dim">Tags</div>
      </div>
      <div className="card p-6 text-center">
        <div className="text-3xl font-semibold">{views.toLocaleString()}</div>
        <div className="text-dim">Estimated views</div>
      </div>
    </section>
  );
}
