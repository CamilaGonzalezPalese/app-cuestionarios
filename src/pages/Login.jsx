import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function upSubmit() {
        try {
            // Buscar usuario por email (GET)
            const response = await fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.length > 0) {
                // Usuario encontrado, ir a la siguiente página
                console.log("Login exitoso");
                navigate("/cuestionarios/:iduser");
            } else {
                // Usuario no encontrado, registrar (POST)
                const regResponse = await fetch('http://localhost:3000/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const regData = await regResponse.json();
                console.log("Usuario registrado:", regData);
                navigate("/cuestionarios");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <>
            <div>
                <label>Ingrese correo electrónico</label>
                <input
                    className="inpuItem"
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                /><br />
                <button className="boton" onClick={upSubmit}>
                    Entrar
                </button>
            </div>
        </>
    );
}
export default Login;