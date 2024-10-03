/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'my-cache-v1';
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/static/css/main.css',
                '/static/js/bundle.js',
                // Asegúrate de agregar cualquier archivo estático que necesites
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes(API_URL)) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});

