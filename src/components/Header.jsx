// Header.jsx
import "./Header.css";
import { useTheme } from '../context/DarkContext.jsx';
import { Link } from 'react-router-dom';


function Button({ children, onClick, to, darkMode }) {
    const className = 'toggle-button ' + (darkMode ? 'dark' : 'light');

    if (to) {
        return (
            <Link to={to} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    );
}
const Header = () => {
    const { darkMode, toggleTheme } = useTheme();
    const themeClass = darkMode ? 'dark' : 'light';

    return (
        <header className={"header " + themeClass}>
            <h1 className="title">Cuestionario APP</h1>
            
            <div className="header-buttons">
            <Button to="/" darkMode={darkMode}>
                    Ir a Pagina Principal
                </Button>
                <Button to="/gestion" darkMode={darkMode}>
                    Ir a Gestión
                </Button>
                <Button onClick={toggleTheme} darkMode={darkMode}>
                    Toggle theme
                </Button>

            </div>
        </header>

    );
};

export default Header;