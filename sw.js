const CACHE = 'learn-with-minni-v1';

const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/assets/images/minni.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/sounds/this-is.wav',
  '/assets/sounds/start.wav',
  '/assets/sounds/ear.wav',
  '/assets/sounds/hand.wav',
  '/assets/sounds/feet.wav',
  '/assets/sounds/nose.wav',
  '/assets/sounds/tummy.wav',
  '/assets/sounds/byebye.wav',
  '/assets/sounds/quit.wav',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
