import PropTypes from "prop-types";
import React, { useState } from "react";
import "../styles/Pagination.css";

const Pagination = ({ dataPerPage, dataLength, paginate }) => {
  const [active, setActive] = useState(1);

  function getPageNumbers() {
    return Array.from(
      { length: Math.ceil(dataLength / dataPerPage) },
      (_, i) => i + 1
    );
  }

  function setClass(prev, curr) {
    if (prev == curr) {
      return;
    }
    const oldButton = document.getElementById(prev);
    oldButton.classList.remove("active");
    const newButton = document.getElementById(curr);
    newButton.classList.add("active");
  }
  return (
    <nav>
      <ul className="pagination">
        {getPageNumbers().map((number) => (
          <li key={number} className="page-item">
            <button
              id={number}
              onClick={(e) => {
                e.preventDefault();
                setClass(active, number);
                setActive(number);
                paginate(number);
              }}
              className={active === number ? "page-link active" : "page-link"}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  dataPerPage: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
};

export default Pagination;
