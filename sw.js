const CACHE_NAME = 'nuolaidu-korteles-v5';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './img/iki.jpg',
  './img/iki_scan.png',
  './img/iki_logo.png',
  './img/maxima.jpg',
  './img/maxima_scan.png',
  './img/maxima_logo.png',
  './img/lidl.jpg',
  './img/lidl_scan.png',
  './img/lidl_logo.png',
  './img/norfa.jpg',
  './img/norfa_scan.png',
  './img/norfa_logo.png',
  './img/promo.jpg',
  './img/promo_scan.png',
  './img/promo_logo.png',
  './img/senukai.jpg',
  './img/senukai_scan.png',
  './img/senukai_logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fromNetwork = fetch(event.request)
        .then((response) => {
          if (response.ok && new URL(event.request.url).origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match('./index.html'));

      return cached || fromNetwork;
    })
  );
});
