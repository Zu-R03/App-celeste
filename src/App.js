import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Index from "./views/index";
import Register from "./views/register";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Index />} />
                <Route path="/sign-up" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
