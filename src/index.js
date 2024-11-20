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

const VAPID_PUBLIC_KEY = 'BNyHwQF_6yj6Iko4XWppzl4PFDc6fvb-cNm243Der9dhJct5Wv3JDezNYUOsCwdljvf6i4jehq_Yiou84QYGtLk';

// Verificar si el usuario está logueado
const user = JSON.parse(sessionStorage.getItem('user'));

// Solo registrar el Service Worker si el usuario está logueado
if (user && 'serviceWorker' in navigator && 'PushManager' in window) {

  const user = JSON.parse(sessionStorage.getItem('user'));

  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registrado con éxito:', registration);

      // Pedimos permiso para notificaciones
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

              // Enviar la suscripción al servidor
              const response = await fetch('https://symphony-server.onrender.com/api/suscripciones/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  subscription: subscription // Enviar el objeto completo
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

  fetch('https://symphony-server.onrender.com/api/users/login', {
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
    // Si la autenticación es exitosa, puedes guardar el token en sessionStorage
    console.log('Autenticación exitosa:', data);

    // Guardar el token o algún dato relevante en sessionStorage
    sessionStorage.setItem('authToken', data.token); // Suponiendo que la respuesta incluye un token
    sessionStorage.setItem('user', JSON.stringify(data.user)); // Guardar información del usuario

    // Mostrar una alerta de éxito con SweetAlert2
    Swal.fire({
      title: 'Login exitoso!',
      text: 'Hola ' + data.user.name, // Puedes mostrar el nombre del usuario si lo tienes
      icon: 'success',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      // Redirigir a la página principal después de que el usuario presione "Aceptar"
      window.location.href = '/'; // Redirige a la página principal
    });

  })
  .catch(error => {
    console.error('Error en la solicitud de inicio de sesión:', error);

    // Mostrar una alerta de error con SweetAlert2
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

  fetch('https://symphony-server.onrender.com/api/users/create-user', {
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

      // Mostrar alerta de éxito con SweetAlert2
      Swal.fire({
        title: 'Cuenta creada!',
        text: 'Tu cuenta ha sido creada exitosamente. ¡Bienvenido!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      })
  })
  .catch(error => {
      console.log('Error en la solicitud, guardando en la BD del navegador:', error);
      Swal.fire({
        title: 'Sin conexión',
        text: 'No tienes conexión a internet. Guardaremos tus datos para intentarlo más tarde.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      guardarEnIndexedDB(name, lastname, email, password);

      // Registramos la sincronización para reintentar el envío
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then(sw => {
              return sw.sync.register('sync-usuarios');
          }).catch(err => console.log('Error registrando el sync:', err));
      }
  });
}

function guardarEnIndexedDB(name, lastname, email, password) {
  let db = window.indexedDB.open('database');

  db.onsuccess = event => {
      let result = event.target.result;
      let transaccion = result.transaction('usuarios', 'readwrite');
      let obj = transaccion.objectStore('usuarios');

      let resultado = obj.add({ name: name, lastname: lastname, email: email, password: password });
      resultado.onsuccess = event => {
          console.log("Inserción realizada en IndexedDB");
      };
      resultado.onerror = event => {
          console.error("Error al insertar en IndexedDB:", event.target.error);
      };
  };

  db.onerror = event => {
      console.error('Error al abrir la base de datos:', event.target.error);
  };
}

reportWebVitals();