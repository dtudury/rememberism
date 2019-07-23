/* global self caches */

/*
const CACHE_NAME = 'rememberism-cache-v1'

const FILES_TO_CACHE = [
  'https://unpkg.com/horseless/dist/horseless.esm.js'
]
*/

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install')
  /*
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page')
      return cache.addAll(FILES_TO_CACHE)
    })
  )
  */
  self.skipWaiting()
})

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate')
  self.clients.claim()
})

/*
self.addEventListener('fetch', (evt) => {
  if (evt.request.url === 'https://unpkg.com/horseless/dist/horseless.esm.js') {
    console.log('\n\n\ntada')
    console.log('[ServiceWorker] Fetch', evt.request)
    evt.respondWith(
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('retrieved.')
          let result = cache.match('/horseless.esm.js')
          console.log(result)
          return result.then(r => {
            console.log(r)
            return r
          })
        })
    )
  }
})
*/
