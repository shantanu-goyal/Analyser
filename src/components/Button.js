import "../styles/Button.css"
function Button({children,height, width, onClick}){
    return(
        <button className="tbl-btn" style={{height, width}} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button