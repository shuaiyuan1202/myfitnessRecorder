// Service Worker for FitTrack
const CACHE_NAME = 'fittrack-v1';
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/daisyui@4.7.2/dist/full.min.css',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/vue@3/dist/vue.global.prod.js',
  'https://unpkg.com/vue-router@4/dist/vue-router.global.prod.js',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pinia/2.1.7/pinia.iife.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});