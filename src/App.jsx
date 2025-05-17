import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './context/DarkContext.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Cuestionarios from './pages/Cuestionario.jsx';
import Preguntas from './pages/Pregunta.jsx';
import Respuesta from './pages/Respuesta.jsx';

import './App.css'

function App() {
  return (
    <>
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cuestionarios" element={<Cuestionarios />} />
        <Route path="/cuestionarios/:id_cuestionario" element={<Preguntas />} /> 
        <Route path="/cuestionarios/:id_cuestionario/pregunta/:id_pregunta/:tipo" element={<Respuesta />} />
      </Routes>
    </ThemeProvider>
    </>
  );
}

export default App;
