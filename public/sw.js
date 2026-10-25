const CACHE_PREFIX = 'accentra-';
const CACHE_NAME = 'accentra-static-v3';
const PAGE_CACHE_NAME = 'accentra-pages-v2';
const OFFLINE_URL = '/offline.html';
const STATIC_URLS = [
    OFFLINE_URL,
    '/manifest.webmanifest',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/icons/accentra-192.png',
    '/icons/accentra-512.png',
    '/icons/accentra-maskable-512.png',
];

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        void self.skipWaiting();
    }
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_URLS))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames
                        .filter(
                            (cacheName) =>
                                cacheName.startsWith(CACHE_PREFIX) &&
                                ![CACHE_NAME, PAGE_CACHE_NAME].includes(cacheName),
                        )
                        .map((cacheName) => caches.delete(cacheName)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (request.method !== 'GET') {
        if (
            request.method === 'POST' &&
            ['/logout', '/student/logout', '/faculty/logout'].includes(
                url.pathname,
            )
        ) {
            event.respondWith(
                fetch(request).then(async (response) => {
                    if (response.ok || response.redirected) {
                        await caches.delete(PAGE_CACHE_NAME);
                    }

                    return response;
                }),
            );
        }

        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(async (response) => {
                    if (
                        response.ok &&
                        response.headers
                            .get('content-type')
                            ?.includes('text/html')
                    ) {
                        const cache = await caches.open(PAGE_CACHE_NAME);
                        await cache.put(request, response.clone());
                    }

                    return response;
                })
                .catch(async () => {
                    const pageCache = await caches.open(PAGE_CACHE_NAME);
                    const cachedPage = await pageCache.match(request);

                    if (cachedPage) {
                        return cachedPage;
                    }

                    const staticCache = await caches.open(CACHE_NAME);
                    const offlinePage = await staticCache.match(OFFLINE_URL);

                    if (!offlinePage) {
                        throw new Error('The offline page is not available.');
                    }

                    return offlinePage;
                }),
        );

        return;
    }

    if (
        url.pathname.startsWith('/build/assets/') ||
        url.pathname.startsWith('/icons/') ||
        url.pathname === '/favicon.svg' ||
        url.pathname === '/apple-touch-icon.png' ||
        url.pathname === '/manifest.webmanifest'
    ) {
        event.respondWith(
            caches.match(request).then(
                (cachedResponse) =>
                    cachedResponse ||
                    fetch(request).then(async (response) => {
                        if (response.ok) {
                            const cache = await caches.open(CACHE_NAME);
                            await cache.put(request, response.clone());
                        }

                        return response;
                    }),
            ),
        );
    }
});
