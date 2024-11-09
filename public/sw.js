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

// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};

    const title = data.title || 'Nueva Notificación';
    const options = {
        body: data.body || 'Tienes una nueva notificación.',
        icon: '/images/icon.png',  // Agrega una imagen de ícono si tienes
        badge: '/images/badge.png'  // Agrega una imagen de insignia si tienes
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Maneja el evento de clic en la notificación para redirigir al usuario
// eslint-disable-next-line no-restricted-globals
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('sync', event => {
    if (event.tag === 'sync-usuarios') {
        event.waitUntil(sincronizarUsuarios());
    }
});

// Función para sincronizar usuarios guardados en IndexedDB con el servidor
function sincronizarUsuarios() {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open('database');

        dbRequest.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction('usuarios', 'readwrite');
            const store = transaction.objectStore('usuarios');

            store.getAll().onsuccess = async event => {
                const usuarios = event.target.result;

                for (const usuario of usuarios) {
                    try {
                        const response = await fetch('https://reqres.in/api/users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(usuario)
                        });

                        if (response.ok) {
                            store.delete(usuario.id);  // Borra el usuario después de enviar
                        }
                    } catch (error) {
                        console.error('Error al sincronizar usuario:', error);
                        reject(error);
                    }
                }
                resolve();
            };
        };

        dbRequest.onerror = error => {
            console.error('Error al abrir la base de datos:', error);
            reject(error);
        };
    });
}