const VERSION = "v2";
const RUNTIME = `runtime-${VERSION}`;
const IS_DEV =
    self.location.hostname === "localhost" ||
    self.location.hostname.startsWith("192.168.");

if (IS_DEV) {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => {
        event.waitUntil(
            (async () => {
                const keys = await caches.keys();
                await Promise.all(keys.map((k) => caches.delete(k)));
                await self.clients.claim();
            })()
        );
    });
    self.addEventListener("fetch", () => {});
} else {
    self.addEventListener("install", () => {
        self.skipWaiting();
    });

    self.addEventListener("activate", (event) => {
        event.waitUntil(
            (async () => {
                const keys = await caches.keys();
                await Promise.all(keys.filter((k) => k !== RUNTIME).map((k) => caches.delete(k)));
                await self.clients.claim();
            })()
        );
    });

    self.addEventListener("fetch", (event) => {
        const req = event.request;
        if (req.method !== "GET") return;
        const url = new URL(req.url);

        if (req.mode === "navigate") {
            event.respondWith(
                (async () => {
                    try {
                        const net = await fetch(req);
                        const c = await caches.open(RUNTIME);
                        c.put(req, net.clone());
                        return net;
                    } catch {
                        const cached = await caches.match(req);
                        return cached || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
                    }
                })()
            );
            return;
        }

        if (url.origin === location.origin && /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/.test(url.pathname)) {
            event.respondWith(
                (async () => {
                    const cached = await caches.match(req);
                    if (cached) return cached;
                    try {
                        const net = await fetch(req);
                        const c = await caches.open(RUNTIME);
                        c.put(req, net.clone());
                        return net;
                    } catch {
                        return cached || Response.error();
                    }
                })()
            );
            return;
        }

        event.respondWith(fetch(req).catch(() => caches.match(req)));
    });
}
