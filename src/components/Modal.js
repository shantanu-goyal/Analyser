import { useState } from "react";
import "../styles/Modal.css";
import Button from "./Button";
function Modal({ name, children }) {
  const [visible, setVisible] = useState(false);

  function toggleVisibility() {
    setVisible(!visible);
  }

  return (
    <>
      <Button onClick={toggleVisibility}>{name}</Button>
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
