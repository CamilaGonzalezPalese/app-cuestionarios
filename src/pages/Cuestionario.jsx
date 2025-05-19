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

    const MostrarPreguntas = (cuestionario) => {
    try {
        navigate(`/cuestionarios/${cuestionario.id}`, { state: cuestionario });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCuestionarios();
    }, [params.id_cuestionario, navigate]);
    
    const colores = ['#FF5733', '#33FF57', '#3357FF', '#F0C929', '#C933F0'];
    return (
        <>
            {!loading && !error ? (
                <div className={'cuestionario-container'}>
                    <h2>Questions</h2>
                    {cuestionarios.map((cuestionario) =>
                        <div
                            className={'cuestionario-item'}
                            key={cuestionario.id}
                            onClick={() => MostrarPreguntas(cuestionario)}
                            style={{
                                backgroundColor: colores[cuestionario.id % colores.length],
                                padding: '10px',
                                margin: '5px',
                                color: '#fff'
                            }}
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