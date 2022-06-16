import PropTypes from "prop-types";
import React, { useEffect, useState,useRef, useContext } from "react";
import "../styles/ThirdPartyTable.css";
import { DataContext } from "../contexts/DataContext";
import Table from "./Table";

/**
 * Function to create JSX of ThirdPartyTable element
 * @param {String} id id of the audit for which the table is rendered
 * @param {Array} headings Array of objects containing the table headers
 * @param {Array} items Array of objects containing the table data
 * @param {Function} passData Callback to pass data to graph renderer
 * @returns table jsx
 */
function ThirdPartyTable({ id, all, userInput, scripts, entities, passData }) {
  // State to hold current third party headings according to the view
  const dataContext=useContext(DataContext);

  const [thirdPartyHeadings, setThirdPartyHeadings] = useState([]);
  // State to hold current third party items according to the view
  const [thirdPartyItems, setThirdPartyItems] = useState([]);
  const selectRef=useRef();
  useEffect(() => {
    changeView('entity')
  }, [scripts, entities])

  /**
   * Toogle view of third party table from script view to entity view and vice-versa
   * @param {Object} event Object to hold data for event which triggered view change
   */
  function changeView(view) {
    // If the current view is script view
    dataContext.setData({ type: "updateThirdPartyData", data:{
      scripts:all,
      entities,
      thirdPartyScripts:scripts,
      userInput
    }});
    if (view === "script") {
      // Update Table headings
      selectRef.current.value="script";
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
      selectRef.current.value="entity"
      setThirdPartyHeadings([
        { key: "entity", text: "Third-Party", itemType: "link" },
        { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
        { key: "blockingTime", text: "Render Blocking Time", itemType: "ms" },
        { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
      ]);

      setThirdPartyItems(
        entities.map((entity) => {
          return {
            entity: entity[0],
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
      <select ref={selectRef} className="select-box" onChange={(e) => changeView(e.target.value)}>
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
  entities: PropTypes.arrayOf(PropTypes.array).isRequired,
  passData: PropTypes.func.isRequired,
};

export default ThirdPartyTable;
