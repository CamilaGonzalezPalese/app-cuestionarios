
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './NEPreguntas.css';
import { fetchJson } from '../../components/utils';

function NuevasPreguntas() {
    const [cuestionario, setCuestionario] = useState([]);
    const [pregunta, setpregunta] = useState([]);
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
    const fetchPregunta = async () => {
        try {
            const data = await fetchJson(`http://localhost:3000/pregunta/`);
            setPreguntas(data);
        } catch (err) {
            console.error(err);
            alert("Error al cargar el cuestionario");
        }
    };
    useEffect(() => {

        fetchCuestionario();
        fetchPregunta();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const id = e.target.id.value.trim();
        const id_cuestionario = cuestionarioSeleccionado;
        const tipo = tipoSeleccionado;
        const planteo = e.target.planteo.value.trim();

        if (!/^\d+$/.test(id)) {
            alert("El ID debe ser un número");
            return;
        }

        // Construir el array de opciones
        const opcionesArray = opciones.map((texto, idx) => ({
            id: (idx + 1).toString(),
            texto
        }));

        const postUrl = `http://localhost:3000/pregunta`;
        try {
            const res = await fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Number(id),
                    id_cuestionario,
                    tipo,
                    planteo,
                    opciones: opcionesArray
                }),
            });

            if (!res.ok) {
                throw new Error("Error al guardar el cuestionario");
            }

            const data = await res.json();
            console.log("Cuestionario creado:", data);

            e.target.reset();
            setOpciones(["", "", ""]);
            alert("Cuestionario guardado correctamente");

        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar el cuestionario");
        }
    };

    function volverPreguntas(id_cuestionario) {
        navigate(`/cuestionarios/${id_cuestionario}/`);
    }


    return (
        <div className="nuevo-pregunta-container">
            <div className="nuevo-pregunta-header">
                <h2>Nueva Pregunta</h2>
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
                /> <br />
                <label htmlFor="id_cuestionario">ID Cuestionario</label> <br />
                <select
                    id="id_cuestionario"
                    name="id_cuestionario"
                    value={cuestionarioSeleccionado}
                    onChange={e => setCuestionarioSeleccionado(e.target.value)}
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
                    onChange={e => setTipoSeleccionado(e.target.value)}
                    required
                >
                    <option value="">Selecciona el tipo</option>
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
                            required
                        />
                        <br />
                    </>
                )}

                <button className="nuevo-cuestionario-btn" type="submit">Agregar</button>
            </form>
        </div>

    )
}

export default NuevasPreguntas;