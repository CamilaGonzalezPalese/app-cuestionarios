import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './context/DarkContext.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Cuestionarios from './pages/Cuestionario/Cuestionario.jsx';
import Preguntas from './pages/Preguntas/Pregunta.jsx';
import Respuesta from './pages/Respuesta.jsx';
import NuevoCuestionario from './pages/Cuestionario/NuevoCuestionario.jsx';
import EditarCuestionario from './pages/Cuestionario/EditarCuestionario.jsx';
import NuevasPreguntas from './pages/Preguntas/NuevasPreguntas.jsx';
import EditarPreguntas from './pages/Preguntas/EditarPreguntas.jsx';
import './App.css'

function App() {
  return (
    <>
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cuestionarios" element={<Cuestionarios />} />
        <Route path="/cuestionarios/NuevoCuestionario" element={<NuevoCuestionario />}/>
        <Route path="/cuestionarios/:id_cuestionario/EditarCuestionario" element={<EditarCuestionario />}/>
        <Route path="/cuestionarios/:id_cuestionario" element={<Preguntas />} /> 
        <Route path="/cuestionarios/:id_cuestionario/NuevasPreguntas" element={<NuevasPreguntas />} /> 
        <Route path="/cuestionarios/:id_cuestionario/pregunta/:id_pregunta/EditarPreguntas" element={<EditarPreguntas />} /> 
        <Route path="/cuestionarios/:id_cuestionario/pregunta/:id_pregunta" element={<Respuesta />} />
      </Routes>
    </ThemeProvider>
    </>
  );
}

export default App;
