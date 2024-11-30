import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import './index.css'; 
import App from './App'; 
import reportWebVitals from './reportWebVitals'; 
import { AuthProvider } from './context/AuthContext'; 
import Swal from 'sweetalert2'; 
 
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render( 
  <React.StrictMode> 
    <AuthProvider> 
      <App />  
    </AuthProvider>, 
  </React.StrictMode> 
); 
 
const VAPID_PUBLIC_KEY = 'BAAMnw4LC2YfbQtuCq93Alw4c3LeYVMzNeJvmI6VkE82tDXXAUrQnc9Z0DluwIcMqsEbAp0Hq7U1grgpzGOeDMg'; 
const user = JSON.parse(sessionStorage.getItem('user')); 
 
if (user && 'serviceWorker' in navigator && 'PushManager' in window) { 
  const user = JSON.parse(sessionStorage.getItem('user')); 
  navigator.serviceWorker.register('/sw.js') 
    .then(registration => { 
      console.log('Service Worker registrado con éxito:', registration); 
      Notification.requestPermission().then(permission => { 
        console.log(`Permiso de notificación: ${permission}`); 
        if (permission === 'granted') { 
          navigator.serviceWorker.ready.then(async swRegistration => { 
            console.log('Service Worker está listo.'); 
            try { 
              const subscription = await swRegistration.pushManager.subscribe({ 
                userVisibleOnly: true, 
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) 
              }); 
              console.log('Suscripción creada:', subscription); 
 
              const response = await fetch('https://app-celeste-server.onrender.com/api/suscripciones/subscribe', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },  
                body: JSON.stringify({ 
                  userId: user.id, 
                  subscription: subscription 
                }) 
              }); 
 
              if (response.ok) { 
                console.log('Usuario suscrito exitosamente para notificaciones push'); 
              } else { 
                console.error('Error en la respuesta del servidor:', response.statusText); 
              } 
            } catch (error) { 
              console.error('Error al suscribir al usuario para notificaciones push:', error); 
            } 
          }).catch(error => console.error('Error con Service Worker ready:', error)); 
        } else { 
          console.log('Permiso de notificación denegado'); 
        } 
      }).catch(error => console.error('Error al pedir permiso de notificación:', error)); 
    }) 
    .catch(error => { 
      console.error('Error al registrar el Service Worker:', error); 
    }); 
} else { 
  if (!user) { 
    console.log('El usuario no está logueado. No se solicitarán notificaciones.'); 
  } 
  console.warn('El navegador no soporta Service Worker o Push Manager.'); 
} 
 
function urlBase64ToUint8Array(base64String) { 
  const padding = '='.repeat((4 - base64String.length % 4) % 4); 
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/'); 
  const rawData = window.atob(base64); 
  const outputArray = new Uint8Array(rawData.length); 
  for (let i = 0; i < rawData.length; ++i) { 
    outputArray[i] = rawData.charCodeAt(i); 
  } 
  return outputArray; 
} 
 
let db=window.indexedDB.open('database'); 
 
db.onupgradeneeded=event=>{ 
  let result = event.target.result; 
  result.createObjectStore('usuarios', {keyPath:'id', autoIncrement: true}); 
} 
 
export function login(event) { 
  event.preventDefault(); 
  const email = document.getElementById('email').value; 
  const password = document.getElementById('password').value; 
  const data = { 
    email: email, 
    password: password, 
  }; 
 
  fetch('https://app-celeste-server.onrender.com/api/users/login', { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json', 
    }, 
    body: JSON.stringify(data), 
  }) 
  .then(response => { 
    if (!response.ok) { 
      throw new Error('Fallo en la autenticación'); 
    } 
    return response.json(); 
  }) 
  .then(data => { 
    console.log('Autenticación exitosa:', data); 
 
    sessionStorage.setItem('authToken', data.token); 
    sessionStorage.setItem('user', JSON.stringify(data.user)); 
 
    
    Swal.fire({ 
      title: 'Login exitoso!', 
      text: 'Hola ' + data.user.name, 
      icon: 'success', 
      confirmButtonText: 'Aceptar', 
    }).then(() => { 
     
      window.location.href = '/'; 
    }); 
 
  }) 
  .catch(error => { 
    console.error('Error en la solicitud de inicio de sesión:', error); 
 
    
    Swal.fire({ 
      title: 'Error en el inicio de sesión', 
      text: 'Por favor, revisa tus credenciales.', 
      icon: 'error', 
    }); 
  }); 
} 
 
export function insertar(event) { 
  event.preventDefault(); 
 
  const name = document.getElementById('name').value; 
  const lastname = document.getElementById('lastname').value; 
  const email = document.getElementById('email').value; 
  const password = document.getElementById('password').value; 
 
  const data = { 
    name: name, 
    lastname: lastname, 
    email: email, 
    password: password, 
  }; 
 
  fetch('https://app-celeste-server.onrender.com/api/users/create-user', { 
      method: 'POST', 
      headers: { 
          'Content-Type': 'application/json' 
      }, 
      body: JSON.stringify(data) 
  }) 
  .then(response => { 
      if (!response.ok) { 
          throw new Error('Fallo en la solicitud'); 
      } 
      return response.json(); 
  }) 
  .then(data => { 
      console.log('Cuenta creada exitosamente:', data); 
 
    
      Swal.fire({ 
        title: 'Cuenta creada!', 
        text: 'Tu cuenta ha sido creada exitosamente. ¡Bienvenido!', 
        icon: 'success', 
        confirmButtonText: 'Aceptar', 
      }); 
  }) 
  .catch(async (error) => { 
    console.log('Error en la solicitud:', error); 
 
    if (!navigator.onLine) { 
      
        Swal.fire({ 
            title: 'Sin conexión', 
            text: 'No tienes conexión a internet. Guardaremos tus datos para intentarlo más tarde.', 
            icon: 'warning', 
            confirmButtonText: 'Aceptar', 
        }); 
        guardarEnIndexedDB(name, lastname, email, password); 
 
        if ('serviceWorker' in navigator && 'SyncManager' in window) { 
            navigator.serviceWorker.ready.then(sw => { 
                return sw.sync.register('sync-usuarios'); 
            }).catch(err => console.log('Error registrando el sync:', err)); 
        } 
        return; 
    } 
 
    let errorMessage = 'Error desconocido'; 
    try { 
        const errorResponse = await error.response?.json(); 
        errorMessage = errorResponse?.message || 'Error al procesar la solicitud'; 
    } catch { 
        if (error.response?.status) { 
            errorMessage = `Error del servidor: ${error.response.status}`; 
        } 
    } 
 
    Swal.fire({ 
        title: 'Error al crear la cuenta', 
        text: errorMessage, 
        icon: 'error', 
        confirmButtonText: 'Aceptar', 
    }); 
  }); 
} 
 
function guardarEnIndexedDB(name, lastname, email, password) { 
  let db = window.indexedDB.open('database'); 
  db.onsuccess = event => { 
      let result = event.target.result; 
      let transaccion = result.transaction('usuarios', 'readwrite'); 
      let obj = transaccion.objectStore('usuarios'); 
      let request = obj.get(email); 
      request.onsuccess = event => { 
          if (!event.target.result) { 
              let resultado = obj.add({ name, lastname, email, password }); 
              resultado.onsuccess = () => { 
                  console.log("Inserción realizada en IndexedDB"); 
              }; 
              resultado.onerror = event => { 
                  console.error("Error al insertar en IndexedDB:", event.target.error); 
              }; 
          } else { 
              console.log("El correo ya está registrado en IndexedDB"); 
          } 
      }; 
 
      request.onerror = event => { 
          console.error("Error al buscar en IndexedDB:", event.target.error); 
      }; 
  }; 
 
  db.onerror = event => { 
      console.error('Error al abrir la base de datos:', event.target.error); 
  }; 
} 
 
reportWebVitals(); 