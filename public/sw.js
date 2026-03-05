const CACHE_NAME = 'gurupay-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json', '/favicon.ico', '/logo192.png', '/logo512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // If the request was successful, clone the response and cache it
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(() => {
          // Fallback for navigation requests (SPA routing)
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          // For other requests, return a fallback or error
          return new Response('Network error happened', {
            status: 404,
            statusText: 'Not Found'
          });
        });
      })
  );
});
