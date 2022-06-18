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
function DataTable({ id, headings, items, passData, showPagination }) {
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

  return (
    <>
      <table id={id} className="styled-table data-table">
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

export default memo(DataTable);
