// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', event => {
    caches.open('appShell3').then(cache => {
        cache.addAll([
            '/src/views/index.jsx',
            '/src/views/register.jsx',
            '/images/IMG_9485.jpeg',
        ]);
    });
    

    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', event => {
    caches.delete('appShell2');
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', event => {
    // Solo gestionar solicitudes que sean de HTTP o HTTPS
    if (event.request.url.startsWith('http')) {
        const resp = fetch(event.request).then(respuesta => {
            if (!respuesta) {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    } else {
                        return caches.match('/images/IMG_9485.jpeg');
                    }
                });
            } else {
                return caches.open('dinamico').then(cache => {
                    cache.put(event.request, respuesta.clone());
                    return respuesta;
                });
            }
        }).catch(() => {
            return caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    return caches.match('/images/IMG_9485.jpeg');
                }
            });
        });

        event.respondWith(resp);
    }
});