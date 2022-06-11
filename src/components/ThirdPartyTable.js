import PropTypes from "prop-types";
import React, { useState } from "react";
import "../styles/ThirdPartyTable.css";
import Table from "./Table";

/**
 * Function to create JSX of ThirdPartyTable element
 * @param {String} id id of the audit for which the table is rendered
 * @param {Array} headings Array of objects containing the table headers
 * @param {Array} items Array of objects containing the table data
 * @param {Function} passData Callback to pass data to graph renderer
 * @returns table jsx
 */
function ThirdPartyTable({ id, headings, items, passData }) {
  // State to hold current third party headings according to the view
  const [thirdPartyHeadings, setThirdPartyHeadings] = useState([...headings]);
  // State to hold current third party items according to the view
  const [thirdPartyItems, setThirdPartyItems] = useState([...items]);

  /**
   * Toogle view of third party table from script view to entity view and vice-versa
   * @param {Object} event Object to hold data for event which triggered view change
   */
  function changeView(event) {
    // If the current view is script view
    if (event.target.value === "script") {
      // Update Table headings
      setThirdPartyHeadings([
        { key: "url", text: "URL", itemType: "text" },
        { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
        { key: "blockingTime", text: "Blocking Time", itemType: "ms" },
        { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
      ]);
      // Update thirdPartyItems to hold scripts instead of entities
      setThirdPartyItems(
        items.reduce((arr, item) => {
          if (item.subItems && item.subItems.items) {
            return arr.concat(
              // Filter out scripts
              item.subItems.items.filter(
                (item) => item.url !== "Other resources"
              )
            );
          }
          return arr;
        }, [])
      );
    } else {
      // Default headings and items passed to the ThirdPartyTable are in entity view
      setThirdPartyHeadings([...headings]);
      setThirdPartyItems([...items]);
    }
  }

  return (
    <div className="third-party-wrapper" style={{ marginLeft: "1em" }}>
      <select id="select-box" onChange={changeView}>
        <option value="entity">Entity View</option>
        <option value="script">Script View</option>
      </select>
      <div className="table-container">
        <Table
          id={id}
          headings={thirdPartyHeadings}
          items={thirdPartyItems}
          passData={passData}
        />
      </div>
    </div>
  );
}

ThirdPartyTable.propTypes = {
  id: PropTypes.string.isRequired,
  headings: PropTypes.arrayOf(PropTypes.object).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  passData: PropTypes.func.isRequired,
};

export default ThirdPartyTable;
