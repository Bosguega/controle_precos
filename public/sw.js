const CACHE_NAME = "controle-precos-v2";
const urlsToCache = [
  "/",
  "/cadastro",
  "/pesquisa",
  "/configuracao",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Estratégia: Cache First para recursos estáticos, Network First para API
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  fallback: 'cache-only'
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia para páginas e recursos estáticos
  if (request.method === 'GET' && !url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response; // Retorna do cache se disponível
        }
        return fetch(request).then((response) => {
          // Cache da resposta para uso futuro
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }

  // Estratégia para API - Network First com fallback para cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache da resposta da API
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache se a rede falhar
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Retorna resposta vazia se não houver cache
            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
  }
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