// Header.jsx
import "./Header.css";
import { useTheme } from '../context/DarkContext.jsx';


function Button({ children, onClick, darkMode }) {
     const className = 'toggle-button ' + (darkMode ? 'dark' : 'light');
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
            <Button  onClick={toggleTheme} darkMode={darkMode}>
                Toggle theme
            </Button>
        </header>

    );
};

export default Header;