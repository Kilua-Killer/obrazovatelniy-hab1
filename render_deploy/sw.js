// Service Worker для кэширования ресурсов
const CACHE_NAME = 'obrazovatelniy-hab-v6.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css?v=6.0.0',
  '/script.js?v=6.0.0',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Установка Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Кэширование ресурсов');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация и очистка старого кэша
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Если ресурс в кэше, возвращаем его
        if (response) {
          return response;
        }
        
        // Иначе загружаем из сети
        return fetch(event.request).then(function(response) {
          // Кэшируем только успешные ответы
          if(response.status === 200 && urlsToCache.includes(event.request.url)) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

