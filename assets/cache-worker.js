/**
 * Service Worker: Background Polling + Shared Cache
 * 
 * Alternative approach for fully client-side implementation
 * Uses Service Worker + IndexedDB for offline cache and background sync
 * 
 * Usage:
 * 1. Register in your HTML: navigator.serviceWorker.register('assets/cache-worker.js')
 * 2. Service worker will automatically poll API in background
 * 3. All fetch requests to /api/server-status will use cache first
 */

const CACHE_NAME = 'server-status-cache-v1';
const API_URL = 'https://api.mcsrvstat.us/2/goidacraft.aboba.host';
const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const DB_NAME = 'ServerStatusDB';
const DB_STORE = 'cache';

// ==================== IndexedDB HELPERS ====================
class CacheDB {
  static async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  static async set(key, value) {
    const db = await CacheDB.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([DB_STORE], 'readwrite');
      const store = transaction.objectStore(DB_STORE);
      const request = store.put({ key, value, timestamp: Date.now() });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  static async get(key) {
    const db = await CacheDB.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([DB_STORE], 'readonly');
      const store = transaction.objectStore(DB_STORE);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// ==================== BACKGROUND POLLING ====================
async function pollAPI() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      await CacheDB.set('server-status', data);
      console.log('[CacheWorker] API poll successful');
    }
  } catch (error) {
    console.error('[CacheWorker] Poll error:', error);
  }
}

// Start periodic polling when service worker activates
self.addEventListener('activate', (event) => {
  console.log('[CacheWorker] Activated - starting background polling');
  
  // Initial poll
  event.waitUntil(pollAPI());
  
  // Schedule recurring polls
  setInterval(pollAPI, POLL_INTERVAL);
});

// ==================== FETCH HANDLER ====================
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only intercept GET requests for JSON
  if (request.method !== 'GET' || !request.headers.get('accept')?.includes('application/json')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  try {
    // Try network first (with timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return response;
    }
  } catch (error) {
    console.debug('[CacheWorker] Network failed, using cache:', error.message);
  }

  // Fallback to cache
  try {
    const cached = await CacheDB.get('server-status');
    if (cached) {
      return new Response(JSON.stringify(cached.value), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('[CacheWorker] Cache read error:', error);
  }

  // If everything fails, return error response
  return new Response(
    JSON.stringify({ error: 'Service unavailable', offline: true }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );
}

// ==================== MESSAGE HANDLER ====================
self.addEventListener('message', async (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data.type === 'POLL_NOW') {
    await pollAPI();
  }
});
