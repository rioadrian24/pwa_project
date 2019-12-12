var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/fallback.json',
  '/css/main.css',
  '/js/jquery.min.js',
  '/js/main.js',
  '/images/store.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {

  let request = event.request
  let url = new URL(request.url)

  // Pisahkan request API dan Internal
  if (url.origin === location.origin) {
    event.respondWith(
      cache.match(request).then(function(response){
        return response || fetch(request)
      })
    );
  } else {
    event.respondWith(
      caches.open('products-cache').then(function(cache){
        return fetch(request).then(function(liveResponse){
          cache.put(request, liveResponse.clone())
          return liveResponse
        }).catch(function(){
          return caches.match(request).then(function(response){
            if (response) return response
            return caches.match('/fallback.json')
          })
        })
      })
    )
  }
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.cacheNames.filter(function(cacheName){
          return cacheNames != CACHE_NAME
        }).map(function(cacheName){
          return caches.delete(cacheName)
        })
      );
    })
  );
});
