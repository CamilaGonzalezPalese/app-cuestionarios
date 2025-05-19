/* export default function Preguntas() {
    return null;
} */
import './Pregunta.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';

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
            const response = await fetch(`http://localhost:3000/pregunta?id_cuestionario=${params.id_cuestionario}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            console.log("Datos recibidos:", data); // <-- aquí
            setPreguntas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreguntas();
    }, [params.id_cuestionario]);

    const Responder = (id_cuestionario, id_pregunta, tipo) => {
        navigate(`/cuestionarios/${id_cuestionario}/pregunta/${id_pregunta}/${tipo}`);
    };
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cuestionario) return <p>No se encontró el cuestionario.</p>;
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
                            >
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