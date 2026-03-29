// ══════════════════════════════════════════════════════════════════
//  Service Worker – LogiKron Gare
//  ⚙️  Aggiorna CACHE_NAME ad ogni deploy per forzare il refresh
// ══════════════════════════════════════════════════════════════════

const CACHE_NAME = 'logikron-v4.18';

const STATIC_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './gara.html',
  './tabellone.html',
  './intenzioni.html',
  './iscrizioni.html',
  './regolamento.html',
  './archivio.html',
  './css/style.css',
  './js/config.js',
  './js/api.js',
  './js/math-bg.js',
  './js/confetti.min.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

// ── Install: pre-cacha i file statici ─────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ── Activate: elimina cache vecchie ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first per API backend, cache-first per asset locali ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Le chiamate al backend Apps Script vanno sempre in rete
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleapis.com')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  // File HTML: network-first (così aggiornamenti arrivano subito senza svuotare cache manualmente)
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // CSS, JS, assets: cache-first (cambiano solo con nuovo CACHE_NAME)
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
