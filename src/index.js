import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const VAPID_PUBLIC_KEY = 'BNyHwQF_6yj6Iko4XWppzl4PFDc6fvb-cNm243Der9dhJct5Wv3JDezNYUOsCwdljvf6i4jehq_Yiou84QYGtLk';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  // Primero, pedimos permiso al usuario
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then(async swRegistration => {
        try {
          // Suscribir al usuario
          const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          });
          console.log('Iniciando proceso de registro de suscripción')

          // Enviar la suscripción al servidor
          await fetch('https://symphony-server.onrender.com/api/suscripciones/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          });

          console.log('Usuario suscrito exitosamente para notificaciones push');
        } catch (error) {
          console.error('Error al suscribir al usuario para notificaciones push:', error);
        }
      });
    } else {
      console.log('Permiso de notificación denegado');
    }
  });
}

// Convierte la clave de VAPID a un Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
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
      console.log('Datos enviados con éxito:', data);
  })
  .catch(error => {
      console.log('Error en la solicitud, guardando en la BD del navegador:', error);
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