// Service Worker for FitTrack
const CACHE_NAME = 'fittrack-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './lib/full.min.css',
  './lib/tailwindcss.js',
  './lib/vue.global.prod.js',
  './lib/vue-demi.js',
  './lib/vue-router.global.prod.js',
  './lib/axios.min.js',
  './lib/pinia.iife.min.js',
  './resources/finish.mp3'
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
        // Cache First Strategy
        // If it's in the cache, return it immediately.
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