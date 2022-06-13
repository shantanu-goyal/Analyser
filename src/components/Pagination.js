import React from "react";
import PropTypes from "prop-types";
import "../styles/Pagination.css";
const Pagination = ({ dataPerPage, dataLength, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(dataLength / dataPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={(e) => {
                e.preventDefault();
                paginate(number);
              }}
              className="page-link"
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
