import { useState } from "react";
import "../styles/Modal.css";

function Modal({ name, children }) {
  const [visible, setVisible] = useState(false);

  function toggleVisibility() {
    setVisible(!visible);
  }

  return (
    <>
      <button onClick={toggleVisibility} className="modal-button">{name}</button>
      {visible && (
        <div className="modal">
          <div className="modal-content">
            <img src='close.png' className="modal-close" alt="Close Modal" onClick={toggleVisibility}/>
            {children}</div>
        </div>
      )}
    </>
  );
}

export default Modal;
