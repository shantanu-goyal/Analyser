import { useState } from "react";
import "../styles/AuditHistory.css";
import Button from "./Button";
import Pagination from "./Pagination";

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

  if (metaData.length === 0)
    return <h2 style={{ margin: "0 1em 1em 1em" }}>Nothing To Show Here..</h2>;

  return (
    <>
      {metaData
        .slice(currentPage.indexOfFirstPost, currentPage.indexOfLastPost)
        .map(({ url, dateString, formFactor }, idx) => {
          const date = new Date(dateString);
          return (
            <div className="meta-data" key={dateString}>
              <h3>{url}</h3>
              <div className="meta-details">
                <small>
                  {date.getDate() === new Date().getDate()
                    ? date.toLocaleTimeString()
                    : date.toLocaleDateString()}{" "}
                  | {formFactor}
                </small>
                <Button
                  onClick={() =>
                    clickHandler(currentPage.indexOfFirstPost + idx)
                  }
                >
                  View Analysis
                </Button>
              </div>
            </div>
          );
        })}
      <div className="pg">
        <Pagination
          style={{ backgroundColor: "var(--bg-nav)" }}
          dataPerPage={5}
          dataLength={metaData.length}
          paginate={paginate}
        />
      </div>
    </>
  );
}

export default AuditHistory;
