import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Index from "./views";
import Register from "./views/register";

function App() {

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

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Index />} />
                <Route path="/sign-up" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
