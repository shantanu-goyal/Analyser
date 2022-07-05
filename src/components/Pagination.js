import PropTypes from "prop-types";
import { useState } from "react";
import "../styles/Pagination.css";
import { getPageNumbers } from "../utility/paginationUtility";

/**
 * Function to return JSX for pagination numbers
 * @param {Number} dataPerPage Number of items on each page
 * @param {Number} dataLength Total number of items
 * @param {Function} paginate Function to set pagination data in parent component
 * @returns JSX for pagination
 */
const Pagination = ({style, dataPerPage, dataLength, paginate }) => {
  // State to hold the active page number
  const [active, setActive] = useState(1);

  const LENGTH = Math.ceil(dataLength / dataPerPage);

  return (
    <>
      {(LENGTH > 1) && (
        <nav style={{...style}} >
          <div style={{...style}} className="pagination">
            <div style={{...style}} className="page-item-btn">
              <button className="page-link-button"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(1);
                  paginate(1);
                }}
              > &#x2190; First</button>
            </div>
            {getPageNumbers(active, LENGTH).map((number) => (
              <div key={number} style={{...style}} className="page-item page-item-btn">
                <button
                  id={number}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(number);
                    paginate(number);
                  }}
                  className={active === number ? "page-link active-btn" : "page-link"}
                >
                  {number}
                </button>
              </div>
            ))}
            <div style={{...style}} className="page-item-btn">
              <button  className="page-link-button"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(LENGTH);
                  paginate(LENGTH);
                }}
              >Last &#x2192;</button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

Pagination.propTypes = {
  dataPerPage: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
};

export default Pagination;
