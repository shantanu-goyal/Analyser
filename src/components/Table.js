import PropTypes from "prop-types";
import React, { useEffect, useState, memo } from "react";
import "../styles/Table.css";
import Pagination from "./Pagination";

/**
 * Function to create JSX of table element
 * @param {String} id id of the audit for which the table is rendered
 * @param {Array} headings Array of objects containing the table headers
 * @param {Array} items Array of objects containing the table data
 * @param {Function} passData Callback to pass data to graph renderer
 * @returns table jsx
 */
function Table({ id, headings, items, passData, showPagination, notShowInput }) {
  // State to hold table data items filtered on the search text
  const [filteredItems, setFilteredItems] = useState([]);
  // State to indicate whether the graph is visible
  const [isGraphVisible, setGraphVisible] = useState(false);
  // State to hold current columnwise sorting order for table data items
  const [order, setOrder] = useState(
    headings.reduce((obj, { key }) => {
      // Initial sorting order should be ascending
      Object.assign(obj, {
        [key]: "asc",
      });
      return obj;
    }, {})
  );
  // State to hold current page data for pagination
  const [currentPage, setCurrentPage] = useState({
    indexOfFirstPost: 0,
    indexOfLastPost: 10,
  });

  /**
   * Handle page data management on page change
   * @param {Number} pageNumber
   */
  function paginate(pageNumber) {
    let indexOfLastPost = pageNumber * 10;
    let indexOfFirstPost = indexOfLastPost - 10;
    setCurrentPage({
      indexOfFirstPost,
      indexOfLastPost,
    });
  }

  useEffect(() => {
    // When items change, consider all items as filtered

    setFilteredItems([...items]);
  }, [items]);

  /**
   * Function to trigger search for items on value change in the input field
   * @param {Object} event Object containing the event data that triggered search
   */
  function onSearch(event) {
    // Case insensitive filtering
    const searchText = event.target.value.toLowerCase();
    setFilteredItems(
      items.filter((item) => {
        // Return true if any of the columns match search value
        return headings.some(({ key }) => {
          if (!item[key]) return false;
          if (isNaN(item[key])) {
            if (item[key] && item[key].type && item[key].type === "link")
              return item[key].text.toLowerCase().indexOf(searchText) !== -1;
            else return item[key].toLowerCase().indexOf(searchText) !== -1;
          } else {
            return item[key].toString().indexOf(searchText) !== -1;
          }
        });
      })
    );
  }

  /**
   * Sort items in an order opposite to current sort order
   * @param {object} event data corresponding to event which triggered sorting
   */
  function sortItems(event) {
    // Key of the column which was clicked
    let columnKey = event.target.id;
    setFilteredItems((prevItems) =>
      prevItems.sort((firstItem, secondItem) => {
        // Variable to store order between firstItem and secondItem
        let itemOrder;
        // Set the itemOrder using ascending order sorting
        if (typeof firstItem[columnKey] === "number")
          itemOrder = firstItem[columnKey] - secondItem[columnKey];
        else if (firstItem[columnKey] && firstItem[columnKey].text)
          itemOrder =
            firstItem[columnKey].text < secondItem[columnKey].text ? -1 : 1;
        else itemOrder = firstItem[columnKey] < secondItem[columnKey] ? -1 : 1;
        setOrder(order === "asc" ? "desc" : "asc");
        // Invert the itemOrder if the current sorting order is descending
        return order === "asc" ? itemOrder : itemOrder * -1;
      })
    );
  }

  /**
   * Function to toggle the visibility of the graph
   * @param {object} event data corresponding to event which triggered graph visibility change
   */
  function handleGraphToggle(event) {
    event.preventDefault();
    setGraphVisible(!isGraphVisible);
    passData(!isGraphVisible);
  }

  /**
   * Download current filtered items as JSON object
   */
  async function downloadJSON() {
    // Set filename as id of the audit
    const fileName = id;
    const json = JSON.stringify(filteredItems);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    // Create a link to download the blob
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    // Click the link to download blob and then remove it from document
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>

      {!notShowInput && (
        <>
          <div className="toolbar">
            <input
              type="text"
              placeholder="Type here to search..."
              onChange={onSearch}
            />
            <div className="right-row">
              {passData && (
                <button onClick={handleGraphToggle}>Toggle Graph</button>
              )}
              <button onClick={downloadJSON}>Download JSON</button>
            </div>
          </div>
          <div className="showcase"></div>
        </>
      )}
      
      <table id={id} className="styled-table">
        <thead>
          <tr>
            {headings.map(({ key, text, itemType }) => (
              <th key={key} id={key} onClick={sortItems}>
                {text} {/* Unit of data */}
                {itemType === "ms"
                  ? "(ms)"
                  : itemType === "bytes"
                    ? "(KB)"
                    : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Slice filtered items array to get current page items */}
          {showPagination === false
            ? filteredItems.map((item, index) => {
              return (
                <tr key={index}>
                  {headings.map(({ key, itemType }) => (
                    <td
                      key={key}
                      title={typeof item[key] === "string" ? item[key] : ""}
                    >
                      {isNaN(item[key]) ? (
                        item[key] &&
                          item[key].type &&
                          item[key].type === "link" ? (
                          <a href={item[key].url}>{item[key].text}</a>
                        ) : (
                          item[key]
                        )
                      ) : // Round the number to two digits past decimal point
                        itemType === "bytes" ? (
                          Math.round((item[key] / 1024) * 100) / 100
                        ) : (
                          Math.round(item[key] * 100) / 100
                        )}
                    </td>
                  ))}
                </tr>
              );
            })
            : filteredItems
              .slice(
                currentPage.indexOfFirstPost,
                currentPage.indexOfLastPost + 1
              )
              .map((item, index) => {
                return (
                  <tr key={index}>
                    {headings.map(({ key, itemType }) => (
                      <td
                        key={key}
                        title={typeof item[key] === "string" ? item[key] : ""}
                      >
                        {isNaN(item[key]) ? (
                          item[key] &&
                            item[key].type &&
                            item[key].type === "link" ? (
                            <a href={item[key].url}>{item[key].text}</a>
                          ) : (
                            item[key]
                          )
                        ) : // Round the number to two digits past decimal point
                          itemType === "bytes" ? (
                            Math.round((item[key] / 1024) * 100) / 100
                          ) : (
                            Math.round(item[key] * 100) / 100
                          )}
                      </td>
                    ))}
                  </tr>
                );
              })}
        </tbody>
      </table>
      {showPagination !== false && (
        <Pagination
          dataPerPage={10}
          dataLength={filteredItems.length}
          paginate={paginate}
        ></Pagination>
      )}
    </>
  );
}

Table.propTypes = {
  id: PropTypes.string.isRequired,
  headings: PropTypes.arrayOf(PropTypes.object).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  passData: PropTypes.func,
};


export default memo(Table);
