// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('appShell').then(cache => {
            return cache.addAll([
                '/images/IMG_9485.jpeg'
            ]);
        })
    );

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

self.addEventListener('push', event => {
    const payload = event.data.json();
    
    // Configuración de la notificación
    const title = payload.title || 'Nueva Notificación';
    const options = {
      body: payload.body || 'Tienes una nueva notificación',
    };
  
    // Mostrar la notificación
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
});

self.addEventListener('sync', event=>{
    console.log('sync:', event.tag)
})

self.addEventListener('fetch', event=>{
    if(event.request.url.includes('https://symphony-server.onrender.com/api/users/create-user')){
        fetch(event.request)
        .catch(error=>{
            self.registration.sync.register('insertar');
        })
    }
})

self.addEventListener('sync', event => {
    if (event.tag === 'sync-usuarios') {
        event.waitUntil(enviarDatosGuardados());
    }
});

function enviarDatosGuardados() {
    let db = indexedDB.open('database');

    db.onsuccess = event => {
        let result = event.target.result;
        procesarRegistros(result);  // Iniciar procesamiento de los registros
    };

    db.onerror = event => {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}

function procesarRegistros(result) {
    let transaccion = result.transaction('usuarios', 'readonly');
    let objStore = transaccion.objectStore('usuarios');

    let cursorRequest = objStore.openCursor();

    cursorRequest.onsuccess = event => {
        let cursor = event.target.result;

        if (cursor) {
            let currentValue = cursor.value;

            // Enviar los datos a la API
            fetch('https://symphony-server.onrender.com/api/users/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentValue)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Datos enviados con éxito:', data);

                // Abrir una nueva transacción para eliminar el registro
                let deleteTransaction = result.transaction('usuarios', 'readwrite');
                let deleteStore = deleteTransaction.objectStore('usuarios');
                let deleteRequest = deleteStore.delete(cursor.key);

                deleteRequest.onsuccess = () => {
                    console.log('Registro eliminado con éxito');
                    // Volver a abrir el cursor después de eliminar
                    procesarRegistros(result);  // Volver a llamar para continuar con los siguientes registros
                };

                deleteRequest.onerror = () => {
                    console.error('Error al eliminar el registro');
                };
            })
            .catch(error => {
                console.error('Error al enviar los datos guardados:', error);
            });
        } else {
            console.log('No hay más registros que enviar');
        }
    };

    cursorRequest.onerror = event => {
        console.error('Error al abrir el cursor:', event.target.error);
    };
}