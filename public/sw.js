/**
 * Service Worker para DHARMA (FASE 13 — EXPERIENCIA MÓVIL & PWA ANDROID)
 *
 * Características:
 * - Soporte offline completo para la App Shell (HTML, CSS, JS, Iconos, Fuentes).
 * - Estrategia Stale-While-Revalidate para recursos estáticos.
 * - Estrategia Network-First con fallback a cache para navegación.
 * - Limpieza automática de versiones anteriores.
 */

const CACHE_NAME = 'dharma-pwa-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable.png',
];

// 1. INSTALACIÓN
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Algunos recursos iniciales no pudieron precachearse:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. ACTIVACIÓN Y LIMPIEZA DE CACHES ANTIGUAS
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name.startsWith('dharma-') && name !== CACHE_NAME) {
            console.log('[SW] Eliminando cache antigua:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. ESTRATEGIA DE FETCH
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones a extensiones de Chrome o esquemas no HTTP(S)
  if (!url.protocol.startsWith('http')) return;

  // Ignorar llamadas directas a APIs externas de Gemini / Google / Supabase
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('generativelanguage.googleapis.com')
  ) {
    return;
  }

  // A. Peticiones de navegación HTML: Network First con fallback a Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const fallback = await caches.match('/index.html');
          return fallback || new Response('Sin conexión offline', { status: 503 });
        })
    );
    return;
  }

  // B. Recursos estáticos (JS, CSS, imágenes, fuentes): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.method === 'GET'
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
