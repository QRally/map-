const cacheName = 'rally-rm-v2'; // Incremented version to force update
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js'
];

// Install: Save assets to cache
self.addEventListener('install', e => {
  self.skipWaiting(); // Forces the waiting service worker to become the active one
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('SW: Caching Assets');
      return cache.addAll(assets);
    })
  );
});

// Activate: Remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName) {
          console.log('SW: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch: Strategy - Network First, falling back to cache
// This ensures that if you have signal, you get the LATEST code from GitHub
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
