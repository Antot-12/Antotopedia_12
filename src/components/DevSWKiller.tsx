"use client";

import { useEffect } from "react";

export default function DevSWKiller() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        const host = window.location.hostname || "";
        const isDev = host === "localhost" || host.startsWith("192.168.");
        if (!isDev) return;

        if ("serviceWorker" in navigator && navigator.serviceWorker.getRegistrations) {
            navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
        }

        const w: any = window as any;
        if (w.caches && typeof w.caches.keys === "function") {
            w.caches.keys().then((keys: string[]) => keys.forEach((k) => w.caches.delete(k)));
        }
    }, []);

    return null;
}
