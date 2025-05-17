/* export default function Preguntas() {
    return null;
} */
import './Pregunta.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from '../context/DarkContext.jsx';

function Preguntas() {
    const [preguntas, setPreguntas] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const { darkMode, toggleTheme } = useTheme();
    const themeClassFondo = darkMode ? "dark-mode" : "light-mode";
    const themeClass = darkMode ? 'dark' : 'light';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchPreguntas = async () => {
        try {
            const response = await fetch(`http://localhost:3000/pregunta/`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
                setPreguntas(data);
                console.log(data);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const Responder = (id_cuestionario,id_pregunta,tipo) => {
        try {
            if (tipo == "MO"){
                console.log("entre al mo")
                navigate(`/cuestionarios/${id_cuestionario}/pregunta/${id_pregunta}/${tipo}`)
            }
            if  (tipo == "TEXTO"){
                console.log("entre al texto")
                navigate(`/cuestionarios/${id_cuestionario}/pregunta/${id_pregunta}/${tipo}`)
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreguntas();
    }, []);
    return (
        <>
            {!loading && !error ? (
                <div className={'pregunta-container'}>
                    {preguntas .filter(pregunta => String(pregunta.id_cuestionario) === String(params.id_cuestionario))
                    .map((pregunta) =>
                        <div className={'pregunta-item'} key={pregunta.id} onClick={() => Responder(pregunta.id_cuestionario,pregunta.id,pregunta.tipo)}>
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