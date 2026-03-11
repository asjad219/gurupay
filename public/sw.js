// Intentionally minimal service worker.
// It self-destructs to prevent stale asset caching across deployments.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      await self.registration.unregister();
      await self.clients.claim();

      const clientList = await self.clients.matchAll({ type: 'window' });
      clientList.forEach((client) => {
        client.postMessage({ type: 'SW_DISABLED' });
      });
    })()
  );
});
