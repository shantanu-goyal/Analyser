import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import Button from "./Button";

function ThemeButton({children}){
    const {darkMode, setDarkMode}=useContext(ThemeContext);
    const handleSubmit=(e)=>{
        e.preventDefault();
        setDarkMode(!darkMode);
        if(!darkMode){
            document.documentElement.setAttribute("data-theme", "dark")
        }
        else{
            document.documentElement.removeAttribute('data-theme')
        }
    }

    return <Button onClick={handleSubmit}>{children}</Button>

}

export default ThemeButton;