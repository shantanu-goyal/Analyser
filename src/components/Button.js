import "../styles/Button.css"
function Button({children,height, width, onClick, style}){
    return(
        <button className="tbl-btn" style={{...style, height, width}} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button