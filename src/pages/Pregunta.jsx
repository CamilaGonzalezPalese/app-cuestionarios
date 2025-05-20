/* export default function Preguntas() {
    return null;
} */
import './Pregunta.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';
import { fetchJson } from '../components/utils.js';

function Preguntas() {
    const [cuestionario, setCuestionario] = useState([]); // <- usa location.state
    const [preguntas, setPreguntas] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    const { darkMode, toggleTheme } = useTheme();
    const themeClassFondo = darkMode ? "dark-mode" : "light-mode";
    const themeClass = darkMode ? 'dark' : 'light';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchPreguntas = async () => {
        try {
            const data = await fetchJson(`http://localhost:3000/pregunta?id_cuestionario=${params.id_cuestionario}`);
            setPreguntas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchCuestionarios = async () => {
        try {
            const data = await fetchJson(`http://localhost:3000/cuestionario?id=${params.id_cuestionario}`);
            setCuestionario(data[0]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreguntas();
        fetchCuestionarios();
    }, [params.id_cuestionario]);

    const Responder = (id_cuestionario, id_pregunta, tipo) => {
        navigate(`/cuestionarios/${id_cuestionario}/pregunta/${id_pregunta}/`);
    };
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cuestionario) return <p>No se encontró el cuestionario.</p>;
    const colores = ['#FF6B6B', '#4ECDC4', '#556270', '#C06C84', '#6C5B7B', '#355C7D', '#FFA726', '#26A69A', '#5C6BC0', '#EF5350'];
    return (
        <>
            {!loading && !error ? (
                <div className={'pregunta-container'}>
                    <h2>Questions</h2>
                    <h2>Cuestionario: {cuestionario.nombre}</h2>
                    <p><strong>Descripción:</strong> {cuestionario.descripcion}</p>

                    {preguntas.filter(pregunta => String(pregunta.id_cuestionario) === String(params.id_cuestionario))

                        .map((pregunta) =>
                            <div className={'pregunta-item'} key={pregunta.id} onClick={() => Responder(pregunta.id_cuestionario, pregunta.id, pregunta.tipo)}
                                style={{
                                    backgroundColor: colores[pregunta.id_cuestionario % colores.length],
                                    padding: '10px',
                                    margin: '5px',
                                    color: '#fff'
                                }}>
                                <p><span>Planteo: </span>{pregunta.planteo}</p>
                                <p><span>Tipo: </span>{pregunta.tipo}</p>
                            </div>
                        )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}
export default Preguntas;