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

// Activate: delete all old caches and force-refresh all open tabs
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            // Claim all open tabs immediately
            return self.clients.claim();
        }).then(() => {
            // Tell ALL open tabs to reload so they pick up fresh files
            // This works even if the old page doesn't have any update listener
            return self.clients.matchAll({ type: 'window' }).then((clients) => {
                clients.forEach((client) => {
                    client.navigate(client.url);
                });
            });
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
