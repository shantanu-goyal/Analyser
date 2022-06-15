import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
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
function ThirdPartyTable({ id, scripts, entities, passData }) {
  // State to hold current third party headings according to the view

  console.log(entities);
  const [thirdPartyHeadings, setThirdPartyHeadings] = useState([]);
  // State to hold current third party items according to the view
  const [thirdPartyItems, setThirdPartyItems] = useState([]);

  useEffect(() => {
    changeView('entity')
  }, [])

  /**
   * Toogle view of third party table from script view to entity view and vice-versa
   * @param {Object} event Object to hold data for event which triggered view change
   */
  function changeView(view) {
    // If the current view is script view
    if (view === "script") {
      // Update Table headings
      setThirdPartyHeadings([
        { key: "url", text: "URL", itemType: "text" },
        { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
        { key: "blockingTime", text: "Render Blocking Time", itemType: "ms" },
        { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
      ]);
      // Update thirdPartyItems to hold scripts instead of entities
      setThirdPartyItems(
        scripts.map((script) => {
          return {
            url: script.url,
            mainThreadTime: script.data.mainThreadTime,
            blockingTime: script.data.blockingTime,
            transferSize: script.data.transferSize,
          };
        })
      );
    } else {
      // Default headings and items passed to the ThirdPartyTable are in entity view
      setThirdPartyHeadings([
        { key: "entity", text: "Third-Party", itemType: "link" },
        { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
        { key: "blockingTime", text: "Render Blocking Time", itemType: "ms" },
        { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
      ]);

      setThirdPartyItems(
        entities.map((entity) => {
          return {
            entity: entity[0].name,
            mainThreadTime: entity[1].mainThreadTime,
            blockingTime: entity[1].blockingTime,
            transferSize: entity[1].transferSize,
          };
        })
      );
    }
  }

  return (
    <div className="third-party-wrapper" style={{ marginLeft: "1em" }}>
      <select className="select-box" onChange={(e) => changeView(e.target.value)}>
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
  headings: PropTypes.arrayOf(PropTypes.object),
  scripts: PropTypes.arrayOf(PropTypes.object).isRequired,
  entities: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  passData: PropTypes.func.isRequired,
};

export default ThirdPartyTable;
