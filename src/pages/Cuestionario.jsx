import './Cuestionario.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';
import { TablaCrud } from '../components/TablaCrud';
import { cuestionarioService } from '../components/utils.js';

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
            navigate(`/cuestionarios/${id_cuestionario}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCuestionarios();
    }, [params.id]);

    const colores = [
        '#b39ddb', // lavanda más fuerte
        '#9575cd', // violeta medio
        '#7e57c2', // violeta oscuro
        '#6f00ff', // violeta intenso
        '#512da8',  // violeta profundo
        '#FF6B6B',
        '#4ECDC4',
        '#556270',
        '#C06C84',
        '#6C5B7B',
        '#355C7D',
        '#FFA726',
        '#26A69A',
        '#5C6BC0',
        '#EF5350'
    ];
    return (
        <>
            {!loading && !error ? (
                <div className={`cuestionario-container ${themeClassFondo}`}>

                    {cuestionarios.map((cuestionario) =>
                        <div
                            className={'cuestionario-item'}
                            key={cuestionario.id}
                            onClick={() => MostrarPreguntas(cuestionario.id)}
                            style={{
                                backgroundColor: colores[cuestionario.id % colores.length],
                                padding: '10px',
                                margin: '5px',
                                color: darkMode ? '#000' : '#fff'
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