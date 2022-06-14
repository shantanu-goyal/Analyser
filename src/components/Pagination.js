import PropTypes from "prop-types";
import React, { useState } from "react";
import "../styles/Pagination.css";

/**
 * Function to return JSX for pagination numbers
 * @param {Number} dataPerPage Number of items on each page
 * @param {Number} dataLength Total number of items
 * @param {Function} paginate Function to set pagination data in parent component
 * @returns JSX for pagination
 */
const Pagination = ({ dataPerPage, dataLength, paginate }) => {
  // State to hold the active page number
  const [active, setActive] = useState(1);

  /**
   *
   * @returns Array of page numbers
   */
  function getPageNumbers() {
    return Array.from(
      { length: Math.ceil(dataLength / dataPerPage) },
      (_, i) => i + 1
    );
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
