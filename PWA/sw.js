const CACHE_NAME = 'app-shell-v1';
const DATA_CACHE_NAME = 'data-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js'
];

// Cachea los archivos del App Shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Archivos del App Shell almacenados en caché');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Elimina cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME && cache !== DATA_CACHE_NAME) {
                        console.log('Eliminando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar las solicitudes
self.addEventListener('fetch', event => {
    if (event.request.url.includes('fake-json-api.mock.beeceptor.com')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        // Almacenar la respuesta en caché
                        cache.put(event.request.url, response.clone());
                        return response;
                    })
                    .catch(() => {
                        // Si hay un error (offline), devolver los datos almacenados en caché
                        return caches.match(event.request);
                    });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});
