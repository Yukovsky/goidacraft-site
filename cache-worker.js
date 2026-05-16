const IMAGE_CACHE = 'goidacraft-images-v2';
const DATA_CACHE = 'goidacraft-data-v2';
const IMAGE_ASSETS = [
  '/assets/img/train.png',
  '/assets/img/title.png',
  '/assets/img/goidalogo.png',
  '/assets/img/sky-bg.webp',
  '/assets/img/hero-bg.webp',
  '/assets/img/gear-small.png',
  '/assets/img/gear-large.png',
  '/assets/cursor/busy.gif',
  '/assets/cursor/resize_nwse.png',
  '/assets/cursor/resize_ns.png',
  '/assets/cursor/resize_nesw.png',
  '/assets/cursor/resize_ew.png',
  '/assets/cursor/resize_all.png',
  '/assets/cursor/pointing_hand.png',
  '/assets/cursor/not_allowed.png',
  '/assets/cursor/ibeam.png',
  '/assets/cursor/grabbing.png',
  '/assets/cursor/default.png',
  '/assets/cursor/crosshair.png',
];
const APP_SHELL = [
  '/',
  '/index.html',
  '/mods.html',
  '/connect.html',
  '/donors.html',
  '/console.html',
  '/assets/styles.css',
  '/assets/decor.js',
  '/assets/donors-data.js',
  '/assets/server-status.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(DATA_CACHE).then((cache) => cache.addAll(APP_SHELL)),
      caches.open(IMAGE_CACHE).then((cache) => cache.addAll(IMAGE_ASSETS)),
    ]).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== IMAGE_CACHE && key !== DATA_CACHE).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.destination === 'image' || /\.(?:png|jpe?g|webp|gif|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirstImage(request));
    return;
  }

  if (url.pathname === '/api/server-status' || request.headers.get('accept')?.includes('application/json')) {
    event.respondWith(networkFirstJson(request));
  }
});

async function cacheFirstImage(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (error) {
    return caches.match(request);
  }
}

async function networkFirstJson(request) {
  const cache = await caches.open(DATA_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone()).catch(() => {});
      return response;
    }
  } catch (error) {
    // Fall back to cache below.
  }

  const cached = await cache.match(request);
  if (cached) return cached;

  return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}