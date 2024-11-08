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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker registrado con éxito:', reg);
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
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

  fetch('https://reqres.in/api/users', {
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

function guardarEnIndexedDB(nombre, trabajo) {
  let db = window.indexedDB.open('database');

  db.onsuccess = event => {
      let result = event.target.result;
      let transaccion = result.transaction('usuarios', 'readwrite');
      let obj = transaccion.objectStore('usuarios');

      let resultado = obj.add({ name: nombre, job: trabajo });
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