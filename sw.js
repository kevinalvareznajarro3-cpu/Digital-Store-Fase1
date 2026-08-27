/* Digital Store — Service Worker
   Sube CACHE_VERSION cada vez que publiques cambios importantes (opcional,
   ya que la estrategia network-first hace que casi nunca haga falta). */
const CACHE_VERSION = 'v4';
const CACHE_NAME = `digital-store-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isAppShell = isSameOrigin && (
    req.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('manifest.webmanifest')
  );

  if (isAppShell) {
    // Network-first: siempre intenta traer la versión más reciente del servidor
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() =>
        caches.match(req).then(r => r || caches.match('./index.html'))
      )
    );
    return;
  }

  // Resto de recursos (íconos, fotos, cdns): cache-first con actualización en segundo plano
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.status === 200 && isSameOrigin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
