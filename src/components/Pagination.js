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
    let numberBehind = Math.min(2, active - 1);
    let numberAhead = Math.min(LENGTH - active, 2)
    if (numberBehind < 2) {
      numberAhead = Math.min(LENGTH - active, 4 - numberBehind);
    }
    else if (numberAhead < 2) {
      numberBehind = Math.min(active - 1, 4 - numberAhead);
    }
    for (let i = Math.max(active - numberBehind, 1); i <= Math.min(active + numberAhead, LENGTH); i++) {
      arr.push(i);
    }
    return arr;
  }
  const LENGTH = Math.ceil(dataLength / dataPerPage);

  return (
    <nav>
      <div className="pagination">
        <div className="page-item-btn">
          <button className="page-link-button"
            onClick={(e) => {
              e.preventDefault();
              setActive(1);
              paginate(1);
            }}
          >First</button>
        </div>
        {getPageNumbers(active).map((number) => (
          <div key={number} className="page-item page-item-btn">
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
          </div>
        ))}
        <div className="page-item-btn">
          <button className="page-link-button"
            onClick={(e) => {
              e.preventDefault();
              setActive(LENGTH);
              paginate(LENGTH);
            }}
          >Last</button>
        </div>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  dataPerPage: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
};

export default Pagination;
