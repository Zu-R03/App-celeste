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
    if (event.request.method === 'POST') {
        return; // No intentamos cachear solicitudes POST
    }

    // Solo gestionar solicitudes que sean de HTTP o HTTPS
    if (event.request.url.startsWith('http')) {
        // Si la solicitud es GET, manejamos la caché
        if (event.request.method === 'GET') {
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
        } else {
            // Para solicitudes POST (o cualquier otro tipo que no sea GET), simplemente pasamos la solicitud
            event.respondWith(fetch(event.request));
        }
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
        console.log('Sincronización iniciada');
        event.waitUntil(sincronizarUsuarios());
    }
  });

// Función para sincronizar usuarios guardados en IndexedDB con el servidor
function sincronizarUsuarios() {
    return new Promise((resolve, reject) => {
        // Abrir la base de datos IndexedDB
        const dbRequest = indexedDB.open('database', 1); // Asegúrate de tener la versión correcta

        dbRequest.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('usuarios')) {
                db.createObjectStore('usuarios', { keyPath: 'id', autoIncrement: true });
            }
        };

        dbRequest.onsuccess = async event => {
            const db = event.target.result;
            try {
                const usuarios = await obtenerUsuarios(db); // Obtener los usuarios guardados
                console.log('Usuarios a sincronizar:', usuarios);

                if (usuarios.length > 0) {
                    for (const usuario of usuarios) {
                        await sincronizarUsuario(db, usuario); // Sincronizar cada usuario
                    }
                    resolve();
                } else {
                    console.log('No hay usuarios para sincronizar');
                    resolve();
                }
            } catch (error) {
                console.error('Error al obtener o sincronizar los usuarios:', error);
                reject(error);
            }
        };

        dbRequest.onerror = error => {
            console.error('Error al abrir la base de datos:', error);
            reject(error);
        };
    });
}

// Obtener todos los usuarios guardados en la base de datos
function obtenerUsuarios(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('usuarios', 'readonly');
        const store = transaction.objectStore('usuarios');
        const request = store.getAll();

        request.onsuccess = event => resolve(event.target.result);
        request.onerror = error => reject(error);
    });
}

// Función para sincronizar un solo usuario con el servidor
async function sincronizarUsuario(db, usuario) {
    try {
        const response = await fetch('https://symphony-server.onrender.com/api/users/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            console.log('Usuario sincronizado con éxito:', usuario);
            await eliminarUsuario(db, usuario.id); // Eliminar usuario de IndexedDB después de sincronizarlo
        } else {
            console.error('Error al sincronizar usuario:', response.statusText);
        }
    } catch (error) {
        console.error('Error al sincronizar usuario:', error);
        throw error; // Propaga el error para que sea manejado por el `catch` de la función principal
    }
}

// Eliminar un usuario de la base de datos después de que se haya sincronizado
function eliminarUsuario(db, userId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('usuarios', 'readwrite');
        const store = transaction.objectStore('usuarios');
        const request = store.delete(userId);

        request.onsuccess = () => {
            console.log('Usuario eliminado de la base de datos:', userId);
            resolve();
        };

        request.onerror = error => {
            console.error('Error al eliminar el usuario:', error);
            reject(error);
        };
    });
}