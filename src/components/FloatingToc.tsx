"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Props = {
  items: TocItem[];
  baseUrl: string;
};

export default function FloatingToc({ items, baseUrl }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Show TOC after scrolling past header
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -35% 0px" }
    );

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div
      className={`fixed right-4 top-1/4 z-30 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
      }`}
    >
      <div className="card bg-black/90 backdrop-blur-sm border-white/20 p-3 max-w-xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wide">
            On This Page
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/50 hover:text-accent transition text-xs"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>

        {/* TOC Items */}
        {isExpanded && (
          <nav className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${item.id}`);
                  }
                }}
                className={`block text-xs py-1.5 px-2 rounded transition ${
                  item.level === 3 ? "pl-4" : ""
                } ${
                  activeId === item.id
                    ? "bg-accent/20 text-accent font-medium border-l-2 border-accent"
                    : "text-white/60 hover:text-accent hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                {item.text}
              </Link>
            ))}
          </nav>
        )}

        {/* Progress indicator */}
        <div className="mt-3 pt-2 border-t border-white/10">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{
                width: `${
                  items.length > 0
                    ? ((items.findIndex((item) => item.id === activeId) + 1) / items.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="text-[10px] text-white/40 mt-1 text-center">
            {items.findIndex((item) => item.id === activeId) + 1} / {items.length}
          </div>
        </div>
      </div>
    </div>
  );
}
