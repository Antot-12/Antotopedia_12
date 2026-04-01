"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Post = {
    id: number;
    slug: string;
    title: string;
    coverImageUrl: string | null;
};

type Dict = {
    notFound: {
        title: string;
        messages: string[];
        description: string;
        searchPlaceholder: string;
        searchButton: string;
        recentPosts: string;
        takeHome: string;
        browseBlog: string;
        breadcrumb: {
            home: string;
            blog: string;
            tags: string;
        };
    };
};

// Seeded random for consistent SSR/client rendering
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export default function NotFoundClient({
    locale = "en",
    dict
}: {
    locale?: string;
    dict?: Dict;
}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Default dictionary if not provided
    const defaultDict: Dict = {
        notFound: {
            title: "Page Not Found",
            messages: [
                "Oops! Page not found",
                "Houston, we have a problem...",
                "This is not the page you're looking for",
                "Error 404: Page is shy",
                "Lost in the digital void",
                "Page.exe has stopped working",
            ],
            description: "Looks like this page went on vacation without telling anyone...",
            searchPlaceholder: "🔍 Search for content instead...",
            searchButton: "Search",
            recentPosts: "Or check out these recent posts",
            takeHome: "Take Me Home",
            browseBlog: "Browse Blog",
            breadcrumb: {
                home: "Home",
                blog: "Blog",
                tags: "Tags",
            }
        }
    };

    const translations = dict || defaultDict;

    // Generate consistent particles using seed
    const particles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            left: Number((seededRandom(i * 100 + 1) * 100).toFixed(2)),
            top: Number((seededRandom(i * 100 + 2) * 100).toFixed(2)),
            width: Number((seededRandom(i * 100 + 3) * 20 + 10).toFixed(2)),
            height: Number((seededRandom(i * 100 + 4) * 20 + 10).toFixed(2)),
            delay: Number((seededRandom(i * 100 + 5) * 5).toFixed(4)),
            duration: Number((seededRandom(i * 100 + 6) * 10 + 10).toFixed(2)),
        })),
    []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Fetch recent posts
    useEffect(() => {
        fetch("/api/posts?limit=3")
            .then(res => res.json())
            .then(data => setRecentPosts(data.slice(0, 3)))
            .catch(() => setRecentPosts([]));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/blog?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const eyeX = mounted && !isHovering ? (mousePosition.x - window.innerWidth / 2) / 50 : 0;
    const eyeY = mounted && !isHovering ? (mousePosition.y - window.innerHeight / 2) / 50 : 0;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-accent/20"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            width: `${particle.width}px`,
                            height: `${particle.height}px`,
                            animationName: 'float',
                            animationDuration: `${particle.duration}s`,
                            animationTimingFunction: 'ease-in-out',
                            animationDelay: `${particle.delay}s`,
                            animationIterationCount: 'infinite',
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-5xl px-4">
                <div className="text-center mb-12">
                    {/* Animated 404 with eyes */}
                    <div className="relative inline-block mb-8">
                        <h1 className="text-[120px] sm:text-[180px] font-bold text-accent animate-pulse-slow relative">
                            4
                            <span className="inline-block relative mx-4">
                                <span className="relative inline-block">
                                    0
                                    {/* Eyes inside the 0 */}
                                    <span className="absolute inset-0 flex items-center justify-center gap-4">
                                        <span
                                            className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-200"
                                            style={{
                                                transform: `translate(${eyeX}px, ${eyeY}px)`,
                                            }}
                                        />
                                        <span
                                            className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-200"
                                            style={{
                                                transform: `translate(${eyeX}px, ${eyeY}px)`,
                                            }}
                                        />
                                    </span>
                                </span>
                            </span>
                            4
                        </h1>
                    </div>

                    {/* Funny messages that cycle */}
                    <div className="mb-6 h-24">
                        <AnimatedMessages messages={translations.notFound.messages} />
                    </div>

                    {/* Glowing description */}
                    <p className="text-dim text-lg mb-8 animate-fade-in">
                        {translations.notFound.description}
                    </p>

                    {/* Search Widget */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="card p-4">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={translations.notFound.searchPlaceholder}
                                    className="input flex-1 text-sm sm:text-base"
                                />
                                <button type="submit" className="btn btn-primary px-6">
                                    {translations.notFound.searchButton}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-2 text-sm text-dim mb-8">
                        <Link href="/" className="hover:text-accent transition-colors">
                            {translations.notFound.breadcrumb.home}
                        </Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-accent transition-colors">
                            {translations.notFound.breadcrumb.blog}
                        </Link>
                        <span>/</span>
                        <Link href="/tags" className="hover:text-accent transition-colors">
                            {translations.notFound.breadcrumb.tags}
                        </Link>
                    </div>

                    {/* Animated buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link
                            href="/"
                            className="group btn btn-primary h-14 px-8 text-lg relative overflow-hidden hover:scale-110 transition-all duration-300"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="group-hover:-translate-x-1 transition-transform"
                                >
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                {translations.notFound.takeHome}
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Link>

                        <Link
                            href="/blog"
                            className="group btn btn-soft h-14 px-8 text-lg hover:scale-110 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="group-hover:rotate-12 transition-transform"
                                >
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                {translations.notFound.browseBlog}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Recent Posts Suggestions */}
                {recentPosts.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-center mb-6">
                            {translations.notFound.recentPosts}
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="card card-hover p-4 group"
                                >
                                    {post.coverImageUrl && (
                                        <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-white/5">
                                            <img
                                                src={post.coverImageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <h4 className="font-semibold text-base group-hover:text-accent transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Floating emoji */}
                <div className="flex justify-center gap-8">
                    {["🤔", "😅", "🔍", "🤷"].map((emoji, i) => (
                        <span
                            key={i}
                            className="text-4xl sm:text-5xl animate-bounce inline-block hover:scale-150 transition-transform cursor-default"
                            style={{
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: "2s",
                            }}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-accent/30 rounded-tl-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-accent/30 rounded-br-3xl animate-pulse-slow" />
        </div>
    );
}

function AnimatedMessages({ messages }: { messages: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % messages.length);
                setIsVisible(true);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <h2
            className={`text-2xl sm:text-4xl font-bold text-white transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
        >
            {messages[currentIndex]}
        </h2>
    );
}
