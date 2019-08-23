/* global self caches fetch */

const CACHE_NAME = 'rememberism-cache-v1'
const HORSELESS_VERSION = '//unpkg.com/horseless@0.0.16/dist/horseless.esm.js'

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
      return cache.match(HORSELESS_VERSION).then(match => {
        if (match) {
          return match
        }
        return fetch(HORSELESS_VERSION).then(res => {
          cache.put(HORSELESS_VERSION, res.clone())
          return res
        })
      })
    }))
  }
})
