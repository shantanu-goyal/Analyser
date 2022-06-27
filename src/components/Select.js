import "../styles/Select.css";

function Select({onChange, children, value, placeholder}){
    return <select className="select-tag" onChange={onChange} value={value} placeholder={placeholder}>
        {children}
    </select>
}

export default Select;