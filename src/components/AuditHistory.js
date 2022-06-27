import Button from "./Button";
import React, { useState } from "react";
import Pagination from "./Pagination";
import "../styles/AuditHistory.css";

function AuditHistory({ metaData, clickHandler }) {
  // State to hold current page data for pagination
  const [currentPage, setCurrentPage] = useState({
    indexOfFirstPost: 0,
    indexOfLastPost: 5,
  });

  /**
   * Handle page data management on page change
   * @param {Number} pageNumber
   */
  function paginate(pageNumber) {
    let indexOfLastPost = pageNumber * 5;
    let indexOfFirstPost = indexOfLastPost - 5;
    setCurrentPage({
      indexOfFirstPost,
      indexOfLastPost,
    });
  }
  return (
    <>
        {!metaData.length && <h2 style={{margin: "0 1em 1em 1em"}}>Nothing To Show Here..</h2>}
      {metaData
        .slice(currentPage.indexOfFirstPost, currentPage.indexOfLastPost + 1)
        .map(({ url, dateString, formFactor }, idx) => {
          const date = new Date(dateString);
          return (
            <div className="meta-data">
              <h3>{url}</h3>
              <div className="meta-details">
                <small>
                  {date.getDate() === new Date().getDate()
                    ? date.toLocaleTimeString()
                    : date.toLocaleDateString()}{" "}
                  | {formFactor}
                </small>
                <Button onClick={() => clickHandler(idx)}>View Analysis</Button>
              </div>
            </div>
          );
        })}
      <div className="paginate">
        <Pagination
          dataPerPage={5}
          dataLength={metaData.length}
          paginate={paginate}
        />
      </div>
    </>
  );
}

export default AuditHistory;
