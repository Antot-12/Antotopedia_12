"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const eyeX = isHovering ? 0 : (mousePosition.x - window.innerWidth / 2) / 50;
    const eyeY = isHovering ? 0 : (mousePosition.y - window.innerHeight / 2) / 50;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-accent/20 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 20 + 10}px`,
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 text-center px-4 max-w-2xl">
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
                    <AnimatedMessages />
                </div>

                {/* Glowing description */}
                <p className="text-dim text-lg mb-8 animate-fade-in">
                    Looks like this page went on vacation without telling anyone...
                </p>

                {/* Animated buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                            Take Me Home
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
                            Browse Blog
                        </span>
                    </Link>
                </div>

                {/* Floating emoji */}
                <div className="mt-12 flex justify-center gap-8">
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

function AnimatedMessages() {
    const messages = [
        "Oops! Page not found",
        "Houston, we have a problem...",
        "This is not the page you're looking for",
        "Error 404: Page is shy",
        "Lost in the digital void",
        "Page.exe has stopped working",
    ];

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
