export default function Hero({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <section className="card p-3 md:p-4">
            <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
            <p className="text-dim text-sm md:text-base">{subtitle}</p>
        </section>
    );
}
