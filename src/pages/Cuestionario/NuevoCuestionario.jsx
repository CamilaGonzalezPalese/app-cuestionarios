
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './NECuestionario.css';
function NuevoCuestionario() {
    const [cuestionario, setCuestionario] = useState([]);
    const [preview, setPreview] = useState(null)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const id = e.target.id.value.trim();
        const nombre = e.target.nombre.value.trim();
        const descripcion = e.target.descripcion.value.trim();

        if (!/^\d+$/.test(id)) {
            alert("El ID debe ser un número");
            return;
        }

        const checkUrl = `http://localhost:3000/cuestionario/${id}`;
        try {
            const checkRes = await fetch(checkUrl);
            if (checkRes.ok) {
                // Ya existe
                alert(`Ya existe un cuestionario con el ID ${id}`);
                return;
            }
        } catch (error) {
            console.error("Error al verificar si existe el cuestionario:", error);
            alert("Error al verificar el ID. Intenta de nuevo.");
            return;
        }

        // ✅ Enviar POST si no existe
        const postUrl = `http://localhost:3000/cuestionario`;
        try {
            const res = await fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: Number(id), nombre, descripcion }),
            });

            if (!res.ok) {
                throw new Error("Error al guardar el cuestionario");
            }

            const data = await res.json();
            console.log("Cuestionario creado:", data);

            // ✅ Limpiar formulario
            e.target.reset();
            alert("Cuestionario guardado correctamente");

        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar el cuestionario");
        }
    };

    function verCuestionarios() {
        navigate('/cuestionarios');
    }
    return (
        <div className="nuevo-cuestionario-container">
            <div className="nuevo-cuestionario-header">
                <h2>Nuevo Cuestionario</h2>
                <button className="btn-volver" onClick={verCuestionarios}>🔙</button>
            </div>
            <form className="nuevo-cuestionario-form" onSubmit={handleSubmit}>
                <label htmlFor="id">ID</label> <br />
                <input 
                    className="nuevo-cuestionario-input" 
                    type="text" 
                    id="id" 
                    name="id" 
                /> <br />

                <label htmlFor="nombre">Nombre</label> <br />
                <input 
                    className="nuevo-cuestionario-input" 
                    type="text"
                    id="nombre" 
                    name="nombre"
                /> <br />

                <label htmlFor="descripcion">Descripción</label> <br />
                <textarea 
                    className="nuevo-cuestionario-textarea" 
                    id="descripcion" 
                    name="descripcion" 
                /> <br />

                <button className="nuevo-cuestionario-btn" type="submit">Agregar</button>
            </form>
        </div>

    )
}

export default NuevoCuestionario;