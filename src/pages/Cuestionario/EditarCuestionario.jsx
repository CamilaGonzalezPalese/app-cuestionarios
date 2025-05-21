import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './NECuestionario.css';
import { fetchJson } from '../../components/utils';


function EditarCuestionario() {
    const [cuestionario, setCuestionario] = useState({ id: '', nombre: '', descripcion: '' });
    const navigate = useNavigate();
    const params = useParams(); 
    useEffect(() => {
        const fetchCuestionario = async () => {
            try {
                const data = await fetchJson(`http://localhost:3000/cuestionario/${params.id_cuestionario}`);
                setCuestionario(data);
            } catch (err) {
                console.error(err);
                alert("Error al cargar el cuestionario");
            }
        };

        fetchCuestionario();
    }, [params.id_cuestionario]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nombre = e.target.nombre.value.trim();
        const descripcion = e.target.descripcion.value.trim();

        try {
            const res = await fetch(`http://localhost:3000/cuestionario/${params.id_cuestionario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: Number(params.id), nombre, descripcion }),
            });

            if (!res.ok) throw new Error("Error al actualizar");

            alert("Cuestionario actualizado correctamente");
            navigate('/cuestionarios');

        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error al actualizar el cuestionario");
        }
    };

    const verCuestionarios = () => {
        navigate('/cuestionarios');
    };

    return (
        <div className="nuevo-cuestionario-container">
            <div className="nuevo-cuestionario-header">
                <h2>Editar Cuestionario</h2>
                <button className="btn-volver" onClick={verCuestionarios}>🔙</button>
            </div>
            <form className="nuevo-cuestionario-form" onSubmit={handleSubmit}>
                <label htmlFor="id">ID</label> <br />
                <input
                    className="nuevo-cuestionario-input"
                    type="text"
                    id="id"
                    name="id"
                    value={cuestionario.id}
                    disabled
                /> <br />

                <label htmlFor="nombre">Nombre</label> <br />
                <input
                    className="nuevo-cuestionario-input"
                    type="text"
                    id="nombre"
                    name="nombre"
                    defaultValue={cuestionario.nombre}
                /> <br />

                <label htmlFor="descripcion">Descripción</label> <br />
                <textarea
                    className="nuevo-cuestionario-textarea"
                    id="descripcion"
                    name="descripcion"
                    defaultValue={cuestionario.descripcion}
                /> <br />

                <button className="nuevo-cuestionario-btn" type="submit">Guardar cambios</button>
            </form>
        </div>
    );
}

export default EditarCuestionario;
