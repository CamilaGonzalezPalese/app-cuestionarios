import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './context/DarkContext.jsx';
import './App.css'

function App() {
  return (
    <>
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cuestionarios" element={<Cuestionarios />} />
        <Route path="/cuestionarios/:id_cuestionario/" element={<Preguntas />} /> 
        <Route path="/cuestionarios/:id_cuestionario/pregunta/:id_pregunta" element={<Respuesta />} />
      </Routes>
    </ThemeProvider>
    </>
  );
}

export default App
