"use client";

import { useEffect, useState } from "react";

export default function LikeButton({ slug }: { slug: string }) {
    const key = `like:${slug}`;
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        try {
            setLiked(localStorage.getItem(key) === "1");
        } catch {}
    }, [key]);

    const toggle = () => {
        const next = !liked;
        setLiked(next);
        try {
            if (next) localStorage.setItem(key, "1");
            else localStorage.removeItem(key);
        } catch {}
    };

    return (
        <button onClick={toggle} className={`btn ${liked ? "btn-primary" : "btn-soft"} h-9`}>
            {liked ? "Liked" : "Like"}
        </button>
    );
}
