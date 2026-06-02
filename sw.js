const CACHE_NAME = "autonomofacil-v1";

const urlsToCache = [
"/",
"/index.html",
"/index3.html",
"/perfil.html",

// módulos
"/clientes.html",
"/servicos.html",
"/agenda.html",
"/financeiro.html",
"/contratos.html",
"/feedbacks.html",
"/conversas.html",
"/veiculos.html",
"/arquivos.html",

// base
"/manifest.json",
"/style.css",
"/app.js",

// imagens (IMPORTANTE)
"/icon-192.png",
"/icon-512.png",

// fallback offline (opcional)
"/offline.html"
];

// INSTALL
self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
);
self.skipWaiting();
});

// ACTIVATE (limpa cache antigo)
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

// FETCH (offline first)
self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request).then(response => {
return response || fetch(event.request).catch(() => {
return caches.match("/offline.html");
});
})
);
});