
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './NEPreguntas.css';
import { fetchJson } from '../../components/utils';

function EditarPreguntas() {
    const [cuestionario, setCuestionario] = useState([]);
    const [cuestionarioSeleccionado, setCuestionarioSeleccionado] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState("");
    const [preguntas, setPreguntas] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const [opciones, setOpciones] = useState(["", "", ""]);
    const fetchCuestionario = async () => {
        try {
            const data = await fetchJson(`http://localhost:3000/cuestionario/${params.id_cuestionario}`);
            setCuestionario(data);
        } catch (err) {
            console.error(err);
            alert("Error al cargar el cuestionario");
        }
    };
    const fetchPreguntaById = async () => {
        try {
            console.log(params.id_pregunta)
            if (!params.id_pregunta) {
                alert("ID de pregunta no válido");
                return;
            }
            const data = await fetchJson(`http://localhost:3000/pregunta/${params.id_pregunta}`);
            console.log("Respuesta de la API:", data);

            if (!data || !data.tipo) {
                alert("No se encontró la pregunta o los datos están incompletos");
                return;
            }

            setPreguntas(data);
            setTipoSeleccionado(data.tipo);
            setCuestionarioSeleccionado(data.id_cuestionario);

            if (data.tipo === "MO") {
                setOpciones((data.opciones || []).map(o => o.texto).concat(["", "", ""]).slice(0, 3));
            } else if (data.tipo === "TEXTO") {
                setOpciones([data.opciones?.[0]?.texto || "", "", ""]);
            }
        } catch (err) {
            console.error("Error al cargar la pregunta:", err);
            alert("Error al cargar la pregunta");
        }
    };
    useEffect(() => {
        fetchCuestionario();
        fetchPreguntaById();
    }, [params.id_pregunta, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const planteo = e.target.planteo.value.trim();
        // Si es MO, opciones es el array, si es TEXTO, solo la primera posición
        const opcionesArray = tipoSeleccionado === "MO"
            ? opciones.map((texto, idx) => ({ id: (idx + 1).toString(), texto }))
            : [{ id: "1", texto: opciones[0] }];

        try {
            const res = await fetch(`http://localhost:3000/pregunta/${params.id_pregunta}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: preguntas.id,
                    id_cuestionario: cuestionarioSeleccionado,
                    tipo: tipoSeleccionado,
                    planteo,
                    opciones: opcionesArray
                }),
            });

            if (!res.ok) throw new Error("Error al actualizar");

            alert("Pregunta actualizada correctamente");
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error al actualizar la pregunta");
        }
    };
    function volverPreguntas(id_cuestionario) {
        navigate(`/cuestionarios/${id_cuestionario}/`);
    }

    return (
        <div className="nuevo-pregunta-container">
            <div className="nuevo-pregunta-header">
                <h2>Editar Pregunta</h2>
                <button
                    className="btn-volver"
                    onClick={() => volverPreguntas(cuestionario.id)}
                >
                    🔙
                </button>
            </div>
            <form className="nuevo-pregunta-form" onSubmit={handleSubmit}>
                <label htmlFor="id">ID</label> <br />
                <input
                    className="nuevo-pregunta-input"
                    type="text"
                    id="id"
                    name="id"
                    value={preguntas.id || ""}
                    readOnly
                /> <br />
                <label htmlFor="id_cuestionario">ID Cuestionario</label> <br />
                <select
                    id="id_cuestionario"
                    name="tipo"
                    value={cuestionarioSeleccionado}
                    readOnly
                    disabled
                >
                    <option value={cuestionario?.id}>
                        {cuestionario?.nombre} (ID: {cuestionario?.id})
                    </option>
                </select>
                <br />
                <label htmlFor="tipo">Tipo</label> <br />
                <select
                    name="tipo"
                    value={tipoSeleccionado}
                    disabled
                >
                    <option value="MO">MO</option>
                    <option value="TEXTO">TEXTO</option>
                </select>
                <br />
                <label htmlFor="planteo">Planteo</label> <br />
                <input
                    className="nuevo-pregunta-input"
                    type="text"
                    id="planteo"
                    name="planteo"
                    defaultValue={preguntas.planteo || ""}
                /> <br />

                {tipoSeleccionado === "MO" && (
                    <>
                        <label>Opciones</label> <br />
                        {opciones.map((opcion, idx) => (
                            <input
                                key={idx}
                                className="nuevo-pregunta-input"
                                type="text"
                                placeholder={`Opción ${idx + 1}`}
                                value={opcion}
                                onChange={e => {
                                    const nuevasOpciones = [...opciones];
                                    nuevasOpciones[idx] = e.target.value;
                                    setOpciones(nuevasOpciones);
                                }}
                                required
                            />
                        ))}
                        <br />
                    </>
                )}

                {tipoSeleccionado === "TEXTO" && (
                    <>
                        <label>Respuesta</label> <br />
                        <input
                            className="nuevo-pregunta-input"
                            type="text"
                            placeholder="Respuesta"
                            value={opciones[0]}
                            onChange={e => {
                                const nuevasOpciones = ["", "", ""];
                                nuevasOpciones[0] = e.target.value;
                                setOpciones(nuevasOpciones);
                            }}
                            disabled
                        />
                        <br />
                    </>
                )}
                <button className="nuevo-cuestionario-btn" type="submit">Editar</button>
            </form>
        </div>

    )
}

export default EditarPreguntas;