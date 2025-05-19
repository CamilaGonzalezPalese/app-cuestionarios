/* export default function Preguntas() {
    return null;
} */
import './Pregunta.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';

function Preguntas() {
    const { id_cuestionario } = useParams();
    const location = useLocation(); // <- define esto primero
    const [cuestionario, setCuestionario] = useState(location.state || null); // <- usa location.state
    const [preguntas, setPreguntas] = useState([]);
    const { state } = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const { darkMode, toggleTheme } = useTheme();
    const themeClassFondo = darkMode ? "dark-mode" : "light-mode";
    const themeClass = darkMode ? 'dark' : 'light';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchPreguntas = async () => {

        fetch(`http://localhost:3000/pregunta?cuestionarioId=${id_cuestionario}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener preguntas");
                return res.json();
            })
            .then(data => setPreguntas(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchPreguntas();
    }, [id_cuestionario]);
    
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