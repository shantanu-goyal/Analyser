import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/Pagination.css";
const Pagination = ({ dataPerPage, dataLength, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(dataLength / dataPerPage); i++) {
    pageNumbers.push(i);
  }

  const [active, setActive] = useState(1);

  function setClass(prev, curr) {
    if (prev == curr) {
      return;
    }
    const oldButton = document.getElementById(prev);
    oldButton.classList.remove('active');
    const newButton = document.getElementById(curr);
    newButton.classList.add('active');
  }
  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button id={number}
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
    </nav >
  );
};

Pagination.propTypes = {
  dataPerPage: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
};

export default Pagination;
