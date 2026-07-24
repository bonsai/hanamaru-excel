const CACHE_NAME = 'hanamaru-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip Firebase/API requests - always go to network
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.pathname.includes('/identity/')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      // Network-first for HTML, cache-first for assets
      if (e.request.mode === 'navigate') {
        return fetch(e.request).catch(() => cached || new Response('Offline', { status: 503 }));
      }
      return cached || fetch(e.request);
    })
  );
});
