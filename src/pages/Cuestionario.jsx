import './Cuestionario.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';

function Cuestionarios() {
    const [cuestionarios, setCuestionarios] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const { darkMode, toggleTheme } = useTheme();
    const themeClassFondo = darkMode ? "dark-mode" : "light-mode";
    const themeClass = darkMode ? 'dark' : 'light';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchCuestionarios = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cuestionario`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setCuestionarios(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const MostrarPreguntas = (id_cuestionario) => {
        try {
            navigate(`/cuestionarios/${id_cuestionario}`)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCuestionarios();
    }, [params.id_cuestionario, navigate]);
    return (
        <>
            {!loading && !error ? (
                <div className={'cuestionario-container'}>
                    {cuestionarios.map((cuestionario) =>
                        <div
                            className={'cuestionario-item'}
                            key={cuestionario.id}
                            onClick={() => MostrarPreguntas(cuestionario.id)}
                        >
                            <p><span>Nombre: </span>{cuestionario.nombre}</p>
                            <br /><br />
                            <p><span>Descripcion: </span>{cuestionario.descripcion}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}
export default Cuestionarios;