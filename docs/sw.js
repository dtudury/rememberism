/* global self caches fetch */

const CACHE_NAME = 'rememberism-cache-v1'

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install')
  self.skipWaiting()
})

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate')
  self.clients.claim()
})

self.addEventListener('fetch', (evt) => {
  if (evt.request.url.endsWith('/horseless.esm.js')) {
    evt.respondWith(caches.open(CACHE_NAME).then(cache => {
      return cache.match('/horseless.esm.js').then(match => {
        if (match) {
          return match
        }
        return fetch(evt.request).then(res => {
          cache.put('/horseless.esm.js', res.clone())
          return res
        })
      })
    }))
  }
})
