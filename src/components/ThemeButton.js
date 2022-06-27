import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import '../styles/ThemeButton.css';

function ThemeButton() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);


    function setDark(){
        setDarkMode(true);
        document.documentElement.setAttribute("data-theme", "dark");
    }

    function setLight(){
        setDarkMode(false);
        document.documentElement.removeAttribute("data-theme");
    }

    const handleSubmit = (e) => {
        if(e.target.checked){
            setDark();
        }
        else{
            setLight();
        }
    }

    const defaultDark=(darkMode===true);
    if(defaultDark){
        setDark();
    }

    return (
        <div className="toggle-theme-wrapper">
            <span>☀️</span>
            <label className="toggle-theme" htmlFor="checkbox">
                <input
                    type="checkbox"
                    id="checkbox"
                    onChange={handleSubmit}
                    defaultChecked={defaultDark}
                />
                <div className="slider round"></div>
            </label>
            <span>🌒</span>
        </div>
    )

}

export default ThemeButton;