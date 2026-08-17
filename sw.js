const CACHE_PREFIX = 'tgm-companion';
const CACHE_VERSION = '2026-08-07-v19';
const APP_CACHE = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './star-ups.html',
  './investments.html',
  './wiki.html',
  './community-data.html',
  './manifest.webmanifest',
  './assets/icons/tgm-icon-192.svg',
  './assets/icons/tgm-icon-512.svg',
  './assets/icons/tgm-icon-maskable.svg',
  './css/style.css',
  './css/footer.css',
  './css/responsive.css',
  './css/dashboard.css',
  './css/investments.css',
  './css/investments-legacy-tree.css',
  './css/wiki.css',
  './css/community-data.css',
  './src/app/pwa.js',
  './src/app/dashboard.js',
  './src/app/starups.js',
  './src/app/investments.js',
  './src/app/investments-legacy-controls.js',
  './src/app/freight-truck-known-data.js',
  './src/app/wiki.js',
  './src/app/community-data.js',
  './src/buildings/catalog.js',
  './src/buildings/engine.js',
  './src/investments/construction.js',
  './src/investments/engine.js',
  './src/data/load.js',
  './src/shared/backup.js',
  './src/shared/storage.js',
  './src/shared/format.js',
  './assets/community/submissions.json',
  './assets/data/building-records.js.gz.b64',
  './assets/data/investment-records.js.gz.b64',
  './assets/data/investment-row-map.js.gz.b64'
];

const scopedUrl = path => new URL(path, self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    const results = await Promise.allSettled(APP_SHELL.map(path => cache.add(scopedUrl(path))));
    const failed = results.filter(result => result.status === 'rejected');
    if (failed.length) console.warn(`TGM PWA: ${failed.length} app-shell assets could not be precached.`);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter(name => name.startsWith(CACHE_PREFIX) && name !== APP_CACHE)
      .map(name => caches.delete(name)));
    if ('navigationPreload' in self.registration) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function networkFirstNavigation(event) {
  const cache = await caches.open(APP_CACHE);
  try {
    const preload = await event.preloadResponse;
    const response = preload || await fetch(event.request);
    if (response?.ok) await cache.put(event.request, response.clone());
    return response;
  } catch {
    return await cache.match(event.request, { ignoreSearch: true })
      || await cache.match(scopedUrl('./index.html'))
      || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(APP_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  const network = fetch(request).then(async response => {
    if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  if (cached) {
    void network;
    return cached;
  }

  return await network || Response.error();
}
