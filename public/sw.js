self.addEventListener('install', event => { 
    event.waitUntil( 
        caches.open('appShell').then(cache => { 
            return cache.addAll([ 
                '/',                         
                '/index.html', 
                '/images/Game.jpg', 
                '/images/Gears.jpg', 
                '/images/LoL-jpg', 
                '/images/Wukong.jpg',               
                '/images/mandarina.png',     
                '/images/mishito.jpg' 
            ]); 
        }) 
    ); 
    self.skipWaiting(); 
}); 
 
self.addEventListener('activate', event => { 
    caches.delete('appShell2'); 
}); 
 
self.addEventListener('fetch', event => { 
    if (event.request.method === 'POST') { 
        return;  
    } 
    if (event.request.url.startsWith('http')) { 
        if (event.request.method === 'GET') { 
            const resp = fetch(event.request).then(respuesta => { 
                if (!respuesta) { 
                    return caches.match(event.request).then(cachedResponse => { 
                        if (cachedResponse) { 
                            return cachedResponse; 
                        } else { 
                            return caches.match('/images/mandarina.png'); 
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
                        return caches.match('/images/mandarina.png'); 
                    } 
                }); 
            }); 
 
            event.respondWith(resp); 
        } else { 
            event.respondWith(fetch(event.request)); 
        } 
    } 
}); 
 
self.addEventListener('push', event => { 
    const payload = event.data.json(); 
     
   
    const title = payload.title || 'Nueva Notificación'; 
    const options = { 
      body: payload.body || 'Tienes una nueva notificación', 
    }; 
    event.waitUntil( 
      self.registration.showNotification(title, options) 
    ); 
}); 
 
self.addEventListener('fetch', event => {
    if (event.request.url.includes('http://localhost:3001/api/users/create-user')) { 
        event.respondWith(  
            fetch(event.request).catch(() => { 
                if ('SyncManager' in self) { 
                    self.registration.sync.register('sync-usuarios'); 
                } 
            }) 
        ); 
    } 
}); 
  
self.addEventListener('sync', event => { 
  if (event.tag === 'sync-usuarios') { 
      event.waitUntil(enviarDatosGuardados()); 
  } 
}); 
    
function enviarDatosGuardados() { 
    let db = indexedDB.open('database'); 
   
    db.onsuccess = event => { 
      let result = event.target.result; 
      procesarRegistros(result); 
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
           fetch('https://app-celeste-server.onrender.com/api/users/create-user', { 
              method: 'POST', 
              headers: { 
                  'Content-Type': 'application/json' 
              }, 
              body: JSON.stringify(currentValue)  
          }) 
          .then(response => response.json()) 
          .then(data => { 
              console.log('Datos enviados con éxito:', data); 
              let deleteTransaction = result.transaction('usuarios', 'readwrite'); 
              let deleteStore = deleteTransaction.objectStore('usuarios'); 
              let deleteRequest = deleteStore.delete(cursor.key);  
              deleteRequest.onsuccess = () => { 
                  console.log('Registro eliminado con éxito'); 
                  procesarRegistros(result);  
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