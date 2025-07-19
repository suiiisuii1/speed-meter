const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sm1.css',
  '/sm1.js',
  '/manifest.json',
  '/speed-meter.png'
];

// install: キャッシュにファイルを保存
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch: キャッシュがあれば返す、なければネットから取得
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});