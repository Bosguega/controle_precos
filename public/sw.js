const CACHE_NAME = "controle-precos-v1";
const urlsToCache = [
  "/",
  "/cadastro",
  "/pesquisa",
  "/_next/static/chunks/pages/_app.js",
  "/_next/static/chunks/pages/cadastro.js",
  "/_next/static/chunks/pages/pesquisa.js",
  "/_next/static/chunks/main.js",
  "/_next/static/css/app.css",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});