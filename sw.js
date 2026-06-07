const CACHE_NAME = "autonomofacil-v5";

const urlsToCache = [
  "/",
  "/index.html",
  "/perfil.html",
  "/cadastro-profissional.html",
  "/profissionais.html",
  
  // Módulos internos do ecossistema
  "/clientes.html",
  "/servicos.html",
  "/agenda.html",
  "/financeiro.html",
  "/contratos.html",
  "/feedbacks.html",
  "/conversas.html",
  "/veiculos.html",
  "/arquivos.html",
  
  // Arquivos base de configuração do PWA
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// INSTALL: Cria o cache e armazena apenas os arquivos existentes
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Elimina qualquer resquício de cache antigo
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH: Estratégia Offline-First para páginas locais com desvio seguro para nuvem
self.addEventListener("fetch", event => {
  // IGNORE MÉTODOS DE CADASTRO (POST, PUT, DELETE): Deixa passar direto para a nuvem sem passar pelo cache
  if (event.request.method !== "GET") {
    return fetch(event.request);
  }

  // DESVIO SEGURO PARA API E SUPABASE: Entrega a requisição direto para a rede de forma oficial
  if (event.request.url.includes("/api/") || event.request.url.includes("/rest/v1/")) {
    return fetch(event.request);
  }

  // Tratamento das páginas estáticas normais do cache
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
