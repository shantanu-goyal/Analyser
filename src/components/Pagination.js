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
  function getPageNumbers(active) {
    const arr = [];
    const length = Math.ceil(dataLength / dataPerPage);
    for (let i = Math.max(active - 4, 2); i <= Math.min(active + 4, length-1); i++) {
      arr.push(i);
    }
    return arr;
  }

  const LENGTH=Math.ceil(dataLength/dataPerPage);

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <button id={1} onClick={(e) => {
                e.preventDefault();
                setActive(1);
                paginate(1);
              }} className={active === 1? "page-link active" : "page-link"}>1</button>
        </li>
        {getPageNumbers(active).map((number) => (
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
        {LENGTH!==1 && (
          <li className="page-item">
          <button id={LENGTH} onClick={(e) => {
                e.preventDefault();
                setActive(LENGTH);
                paginate(LENGTH);
              }} className={active === LENGTH? "page-link active" : "page-link"}>{LENGTH}</button>
        </li>
        )}
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
