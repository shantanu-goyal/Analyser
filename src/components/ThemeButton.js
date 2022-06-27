import { useContext, useRef } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import '../styles/ThemeButton.css'

function ThemeButton() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const handleSubmit = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.setAttribute("data-theme", "dark")
        }
        else {
            document.documentElement.removeAttribute('data-theme')
        }
    }

    return (<label class="switch">
        <input class="switch-input" type="checkbox" onChange={handleSubmit} />
        <span class="switch-label" data-on="On" data-off="Off"></span>
        <span class="switch-handle"></span>
    </label>)

}

export default ThemeButton;