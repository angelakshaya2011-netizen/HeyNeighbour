const CACHE_NAME = 'hey-neighbor-v2';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './data.js',
    './icon-192.png',
    './icon-512.png',
    './splash.png'
];

// Install: cache assets and immediately take over
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    // Force this new SW to activate immediately, replacing the old one
    self.skipWaiting();
});

// Activate: delete all old caches so stale content never lingers
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            // Claim all open tabs so they use this new SW immediately
            return self.clients.claim();
        })
    );
});

// Fetch: network-first strategy — always try the network, fall back to cache for offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If the network succeeds, update the cache with the fresh response
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Network failed (offline) — serve from cache
                return caches.match(event.request);
            })
    );
});
