self.addEventListener('install', event => {
    caches.open('appShell1').then(cache => {
        cache.addAll([
            '/src/views/index.jsx',
            '/src/views/register.jsx',
        ]);
    });
    
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    caches.delete('appShell');
});

self.addEventListener('fetch', event => {
    const resp = fetch(event.request).then(respuesta => {
        if (!respuesta) {
            return caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    return caches.match('/public/images/IMG_9485.jpeg');
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
                return caches.match('/public/images/IMG_9485.jpeg');
            }
        });
    });

    event.respondWith(resp);
});