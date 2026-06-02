const CACHE_NAME = "autonomofacil-v2";

// Lista contendo apenas os arquivos reais do repositório
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Instalação do Service Worker e criação do Cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Cache aberto com sucesso.");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Força o SW novo a virar ativo imediatamente
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle da página na hora
  );
});

// Intercepta as requisições para funcionar Offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o arquivo do cache se encontrar, senão busca na rede
        return response || fetch(event.request);
      })
  );
});
