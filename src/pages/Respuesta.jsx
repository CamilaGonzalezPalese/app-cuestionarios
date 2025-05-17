/* export default function Preguntas() {
    return null;
} */
//import './Pregunta.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';

function Respuestas() {
    const [respuestas, setRespuestas] = useState([]);
    const [respuestaTP, setRespuestaTP] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const { darkMode, toggleTheme } = useTheme();
    const themeClassFondo = darkMode ? "dark-mode" : "light-mode";
    const themeClass = darkMode ? 'dark' : 'light';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const ahora = new Date().toISOString();
    const fetchRespuestas = async () => {
        try {
            const response = await fetch(`http://localhost:3000/pregunta/`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setRespuestas(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRespuestas();
    }, []);
    async function guardarRespuesta(idOpcion) {
        try {

            const responsePregunta = await fetch("http://localhost:3000/pregunta/id_pregunta");
            const updatedPregunta = await responsePregunta.json();
            setFoods(updatedPregunta);
            const responseUser = await fetch("http://localhost:3000/pregunta/id_user");
            const updatedUser = await responseUser.json();
            setFoods(updatedUser);
            await fetch(`http://localhost:3000/respuesta/${idOpcion.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "id_opcion": 1,
                    "id_pregunta": 1,
                    "id_usuario": 1,
                    "respuesta": idOpcion.texto,
                    "fecha_creacion": ahora 
                })
            });

        } catch (err) {
            console.error("Error actualizando el producto:", err);
        }
    }

    // Filtrar respuestas por id_cuestionario, id_pregunta y tipo usando los parámetros de la URL
    const respuestasFiltradas = respuestas.filter(
        respuesta =>
            String(respuesta.id_cuestionario) === String(params.id_cuestionario) &&
            String(respuesta.id) === String(params.id_pregunta) &&
            String(respuesta.tipo) === String(params.tipo)
    );
    console.log('Respuestas filtradas:', respuestasFiltradas);

    return (
        <>
            {!loading && !error ? (
                <div className="respuesta-container">
                    {respuestasFiltradas.length > 0 ? (
                        respuestasFiltradas.map(respuesta => (
                            <div className="respuesta-item" key={respuesta.id}>
                                <p><span>Planteo: </span>{respuesta.planteo}</p>

                                {respuesta.tipo === "MO" && <div>
                                    {respuesta.opciones.map(opcion => (
                                        <div key={opcion.id}>{opcion.texto}</div>
                                    ))}
                                </div>
                                }
                                {respuesta.tipo === "TEXTO" && <input
                                    type="text"
                                    name="text"
                                    placeholder="Agregue respuesta"
                                    value={respuestaTP}
                                    onChange={(e) => setRespuestaTP(e.target.value)}
                                />} <button>Responder</button>
                            </div>
                        ))
                    ) : (
                        <p>No hay preguntas para mostrar.</p>
                    )}
                </div >

            ) : (
                <p>Loading...</p>
            )
            }
        </>
    );
}
export default Respuestas;