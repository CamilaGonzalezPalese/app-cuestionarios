import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';

function Respuestas() {
    const [respuestas, setRespuestas] = useState([]);
    const [respuestaPrevias, setRespuestaPrevias] = useState({});
    const [fechaRespuestas, setFechaRespuestas] = useState({});
    const [respuestaMO, setRespuestaMO] = useState(null); // opción múltiple seleccionada actual
    const [respuestaTP, setRespuestaTP] = useState(""); // texto actual
    const { darkMode } = useTheme();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        const cargarRespuestasUsuario = async () => {
            try {
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                if (!usuario) throw new Error("Usuario no encontrado en sesión");

                const res = await fetch(`http://localhost:3000/respuesta?id_usuario=${usuario.id}`);
                if (!res.ok) throw new Error("Error al cargar respuestas del usuario");
                const data = await res.json();

                const previas = {};
                const fechas = {};
                data.forEach(r => {
                    previas[r.id_pregunta] = r.id_opcion || r.respuesta || "";
                    fechas[r.id_pregunta] = r.fecha_respuesta;
                });
                setRespuestaPrevias(previas);
                setFechaRespuestas(fechas);

                const idPregunta = params.id_pregunta;
                if (previas[idPregunta]) {
                    const preguntaActual = data.find(p => String(p.id_pregunta) === String(idPregunta));
                    if (preguntaActual) {
                        if (preguntaActual.id_opcion) setRespuestaMO(preguntaActual.id_opcion);
                        else setRespuestaTP(preguntaActual.respuesta);
                    }
                }
            } catch (error) {
                console.error("Error al cargar respuestas previas", error);
            }
        };

        fetchRespuestas();
        cargarRespuestasUsuario();
    }, [params.id_pregunta]);

    async function guardarRespuestaMO(idOpcion) {
        try {
            const ahora = new Date().toISOString();

            // Buscar pregunta ya cargada que coincide con cuestionario y pregunta
            const pregunta = respuestas.find(
                r => String(r.id) === String(params.id_pregunta) && String(r.id_cuestionario) === String(params.id_cuestionario)
            );
            if (!pregunta) throw new Error("Pregunta no encontrada o no pertenece al cuestionario");

            const usuario = JSON.parse(localStorage.getItem("usuario"));
            if (!usuario) throw new Error("Usuario no encontrado en sesión");

            const opcionSeleccionada = pregunta.opciones.find(op => op.id === idOpcion);
            const textoRespuesta = opcionSeleccionada ? opcionSeleccionada.texto : "";

            const checkRes = await fetch(`http://localhost:3000/respuesta?id_usuario=${usuario.id}&id_pregunta=${params.id_pregunta}`);
            if (!checkRes.ok) throw new Error("No se pudo verificar si la respuesta ya existe");

            const todasRespuestas = await checkRes.json();
            const respuestasExistentes = todasRespuestas.filter(r => r.id_usuario === usuario.id && r.id_pregunta === params.id_pregunta);
            const respuestaExistente = respuestasExistentes[0];

            const url = respuestaExistente
                ? `http://localhost:3000/respuesta/${respuestaExistente.id}`
                : `http://localhost:3000/respuesta`;

            const metodo = respuestaExistente ? "PUT" : "POST";

            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: usuario.id,
                    id_cuestionario: pregunta.id_cuestionario,
                    id_pregunta: pregunta.id,
                    id_opcion: opcionSeleccionada.id,
                    respuesta: textoRespuesta,
                    fecha_respuesta: ahora,
                }),
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(`Error del servidor: ${res.status} - ${texto}`);
            }

            setRespuestaPrevias(prev => ({ ...prev, [pregunta.id]: opcionSeleccionada.id }));
            setFechaRespuestas(prev => ({ ...prev, [pregunta.id]: ahora }));
            setRespuestaMO(opcionSeleccionada.id);

            console.log("Respuesta guardada o actualizada correctamente");
        } catch (err) {
            console.error("Error actualizando la respuesta:", err);
        }
    }

    async function guardarRespuestaTexto(texto) {
        try {
            var tzoffset = (new Date()).getTimezoneOffset() * 60000;
            var ahora = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

            const responsePregunta = await fetch(`http://localhost:3000/pregunta/${params.id_pregunta}`);
            if (!responsePregunta.ok) throw new Error("No se pudo obtener la pregunta");
            const pregunta = respuestas.find(
                r => String(r.id) === String(params.id_pregunta) && String(r.id_cuestionario) === String(params.id_cuestionario)
            );

            const usuario = JSON.parse(localStorage.getItem("usuario"));
            if (!usuario) throw new Error("Usuario no encontrado en sesión");

            const checkRes = await fetch(`http://localhost:3000/respuesta?id_usuario=${usuario.id}&id_pregunta=${params.id_pregunta}`);
            if (!checkRes.ok) throw new Error("No se pudo verificar si la respuesta ya existe");

            const todasRespuestas = await checkRes.json();
            const respuestasExistentes = todasRespuestas.filter(r => r.id_usuario === usuario.id && r.id_pregunta === params.id_pregunta);
            const respuestaExistente = respuestasExistentes[0];

            const url = respuestaExistente
                ? `http://localhost:3000/respuesta/${respuestaExistente.id}`
                : `http://localhost:3000/respuesta`;

            const metodo = respuestaExistente ? "PUT" : "POST";

            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_cuestionario: pregunta.id_cuestionario,
                    id_pregunta: pregunta.id,
                    id_usuario: usuario.id,
                    respuesta: texto,
                    fecha_respuesta: ahora
                })
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(`Error del servidor: ${res.status} - ${texto}`);
            }

            // Actualizar estado local
            setRespuestaPrevias(prev => ({ ...prev, [pregunta.id]: texto }));
            setFechaRespuestas(prev => ({ ...prev, [pregunta.id]: ahora }));
            setRespuestaTP(texto);

            console.log("Respuesta guardada o actualizada correctamente");

        } catch (err) {
            console.error("Error actualizando la respuesta:", err.message);
        }
    }

    // Filtrar preguntas según params
    const respuestasFiltradas = respuestas.filter(
        r =>
            String(r.id_cuestionario) === String(params.id_cuestionario) &&
            String(r.id) === String(params.id_pregunta)
    );

    return (
        <>
            {!loading && !error ? (
                <div className={`respuesta-container ${darkMode ? "dark-mode" : "light-mode"}`} style={{ position: "relative" }}>
                    {respuestasFiltradas.length > 0 ? (
                        respuestasFiltradas.map(respuesta => (
                            <div className="respuesta-item" key={respuesta.id} style={{ marginBottom: "1.5rem", position: "relative" }}>
                                <p><strong>Planteo:</strong> {respuesta.planteo}</p>

                                {respuesta.tipo === "MO" && (
                                    <div>
                                        {respuesta.opciones.map(opcion => (
                                            <div key={opcion.id}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`respuesta_${respuesta.id}`}
                                                        value={opcion.id}
                                                        checked={respuestaMO === opcion.id || respuestaPrevias[respuesta.id] === opcion.id}
                                                        onChange={() => {
                                                            setRespuestaMO(opcion.id);
                                                            setRespuestaPrevias(prev => ({ ...prev, [respuesta.id]: opcion.id }));
                                                        }}
                                                    />
                                                    {opcion.texto}
                                                </label>
                                            </div>
                                        ))}
                                        <button
                                            disabled={!respuestaMO}
                                            onClick={() => guardarRespuestaMO(respuestaMO)}
                                            style={{ marginTop: "10px" }}
                                        >
                                            Responder
                                        </button>
                                    </div>
                                )}

                                {respuesta.tipo === "TEXTO" && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Agregue respuesta"
                                            value={respuestaTP || respuestaPrevias[respuesta.id] || ""}
                                            onChange={(e) => {
                                                setRespuestaTP(e.target.value);
                                                setRespuestaPrevias(prev => ({ ...prev, [respuesta.id]: e.target.value }));
                                            }}
                                        />
                                        <button
                                            disabled={!respuestaTP}
                                            onClick={() => guardarRespuestaTexto(respuestaTP)}
                                            style={{ marginTop: "10px" }}
                                        >
                                            Responder
                                        </button>
                                    </div>
                                )}

                                {fechaRespuestas[respuesta.id] && (
                                    <div className="respuesta-info" style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        color: "green",
                                        fontWeight: "bold",
                                        fontSize: "0.9rem"
                                    }}>
                                        Respondida: {new Date(fechaRespuestas[respuesta.id]).toLocaleString()}
                                    </div>
                                )}

                            </div>
                        ))
                    ) : (
                        <p>No hay preguntas para mostrar.</p>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default Respuestas;
