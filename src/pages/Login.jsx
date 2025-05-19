import './Login.css';

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTheme } from '../context/DarkContext.jsx';
function Login() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const { darkMode, toggleTheme } = useTheme();
    const themeClassFondo = darkMode ? "dark-mode" : "light-mode";
    const themeClass = darkMode ? 'dark' : 'light';
    async function upSubmit() {
        try {
            const response = await fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.length > 0) {
                console.log("Login exitoso");
                localStorage.setItem("usuario", JSON.stringify(data[0]));
                navigate(`/cuestionarios`);
            } else {
                const regResponse = await fetch('http://localhost:3000/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const regData = await regResponse.json();
                console.log("Usuario registrado:", regData);
                localStorage.setItem("usuario", JSON.stringify(regData));
                navigate(`/cuestionarios/`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <>
            <div className={"login-container " + themeClassFondo}>
                <form className={"login-form " + themeClass} onSubmit={e => { e.preventDefault(); upSubmit(); }}>
                    <label className={"labelInput" + themeClass}>Ingrese correo electrónico</label>
                    <input
                        className={"inpuItem " + themeClass}
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    /><br />
                    <button className="boton" type="submit">
                        Entrar
                    </button>
                </form>
            </div>
        </>
    );
}
export default Login;