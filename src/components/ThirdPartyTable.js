import React, { useEffect, useState, useRef, useContext } from "react";
import "../styles/ThirdPartyTable.css";
import { DataContext } from "../contexts/DataContext";
import Table from "./Table";
import { getHostname } from "../utility/thirdPartyUtility";

/**
 * Function to create JSX of ThirdPartyTable element
 * @param {String} id id of the audit for which the table is rendered
 * @param {Array} userInput Array of the user selections
 * @param {Array} scripts Array of all third party scripts
 * @param {Array} domainWiseScripts Array of all scripts appearing in the dropdown
 * @param {Function} passData Callback to pass data to graph renderer
 * @returns table jsx
 */

function ThirdPartyTable({
  id,
  userInput,
  scripts,
  passData,
  domainWiseScripts,
  children
}) {
  // State to hold current third party headings according to the view
  const dataContext = useContext(DataContext);
  const data = dataContext.data.thirdParty;
  const [thirdPartyHeadings, setThirdPartyHeadings] = useState([]);
  // State to hold current third party items according to the view
  const [thirdPartyItems, setThirdPartyItems] = useState([]);
  const selectRef = useRef("entity");

  useEffect(() => {
    changeView("entity");
    // eslint-disable-next-line
  }, [userInput, scripts, domainWiseScripts]);


  function getEntites() {
    let byEntity = new Map();
    data.map(item => {
      let entity = undefined;
      if (item.entityName) {
        entity = item.entityName.name;
      }
      else {
        let entityArray = userInput.filter(data => {
          if (getHostname(data.key) === item.entity.url) {
            return true;
          }
          return false;
        });

        if (entityArray.length > 0) {
          entity = entityArray[0].value;
        }
      }

      if (entity) {
        let defaultConfig = {
          blockingTime: 0,
          mainThreadTime: 0,
          resourceSize: 0,
          transferSize: 0,
          intervals: []
        }
        let entityData = byEntity.get(entity) || defaultConfig;
        entityData.blockingTime += item.blockingTime;
        entityData.resourceSize += item.resourceSize;
        entityData.transferSize += item.transferSize;
        entityData.mainThreadTime += item.mainThreadTime;
        entityData.intervals = [...entityData.intervals, ...item.intervals]
        byEntity.set(entity, entityData);
      }
      return {};
    })
    return Array.from(byEntity.entries());
  }


  function updateContext() {
    const byEntity = new Map();
    // Update the global data context with the props recieved
    data.map(item => {
      if (item.entityName) {
        const entity = byEntity.get(item.entityName.name) || {
          blockingTime: 0,
          transferSize: 0,
          mainThreadTime: 0,
          resourceSize: 0,
          subItems: {
            items: []
          },
          intervals: [],
          entityName: {}
        }
        entity.blockingTime += item.blockingTime;
        entity.transferSize += item.transferSize;
        entity.mainThreadTime += item.mainThreadTime;
        entity.resourceSize += item.resourceSize;
        entity.subItems.items = [...entity.subItems.items, ...item.subItems.items];
        entity.intervals = [...entity.intervals, ...item.intervals]
        entity.entityName = { name: item.entityName.name };
        byEntity.set(item.entityName.name, entity);
      }
      if (!item.entityName) {
        let entityArray = userInput.filter(dt => {
          if (getHostname(dt.key) === item.entity.url) {
            return true;
          }
          return false;
        });

        if (entityArray.length > 0) {
          let entityName = { name: entityArray[0].value };
          const entity = byEntity.get(entityName.name) || {
            blockingTime: 0,
            transferSize: 0,
            mainThreadTime: 0,
            resourceSize: 0,
            subItems: {
              items: []
            },
            entityName: {},
            intervals: []
          }
          entity.blockingTime += item.blockingTime;
          entity.transferSize += item.transferSize;
          entity.mainThreadTime += item.mainThreadTime;
          entity.resourceSize += item.resourceSize;
          entity.subItems.items = [...entity.subItems.items, ...item.subItems.items];
          entity.entityName = entityName;
          entity.intervals = [...entity.intervals, ...item.intervals];
          byEntity.set(entityName.name, entity);
        }
      }
      return {};
    });

    let dataArray = Array.from(byEntity.values());
    dataArray = dataArray.map(item => {
      item.subItems.items = item.subItems.items.filter(i => {
        return typeof (i.url) == "string";
      })
      return item;
    })

    dataContext.setData({
      type: 'updateThirdParty',
      data: dataArray
    });

    dataContext.setData({
      type: "thirdPartySummary",
      data: {
        thirdPartyScripts: scripts,
        userInput,
        domainScripts: domainWiseScripts
      }
    });
  }


  /**
   * Toogle view of third party table from script view to entity view and vice-versa
   * @param {Object} event Object to hold data for event which triggered view change
   */

  function changeView(view) {
    updateContext();
    // If the current view is script view
    if (view === "script") {
      // Update Table headings
      selectRef.current.value = "script";
      setThirdPartyHeadings([
        { key: "url", text: "URL", itemType: "text" },
        { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
        { key: "blockingTime", text: "Main Thread Blocking Time", itemType: "ms" },
        { key: "resourceSize", text: "Resource Size", itemType: "bytes" },
        { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
      ]);
      // Update thirdPartyItems to hold scripts instead of entities
      setThirdPartyItems(
        scripts.map((script) => {
          return {
            url: script.url,
            mainThreadTime: script.mainThreadTime,
            resourceSize: script.resourceSize,
            transferSize: script.transferSize,
            blockingTime: script.blockingTime
          };
        })
      );
    } else {
      // Default headings and items passed to the ThirdPartyTable are in entity view
      selectRef.current.value = "entity";
      setThirdPartyHeadings([
        { key: "entity", text: "Third-Party", itemType: "link" },
        { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
        { key: "blockingTime", text: "Main Thread Blocking Time", itemType: "ms" },
        { key: "resourceSize", text: "Resource Size", itemType: "bytes" },
        { key: "transferSize", text: "Transfer Size", itemType: "bytes" },

      ]);


      const entities = getEntites();
      setThirdPartyItems(
        entities.map((entity) => {
          return {
            entity: entity[0],
            mainThreadTime: entity[1].mainThreadTime,
            blockingTime: entity[1].blockingTime,
            transferSize: entity[1].transferSize,
            resourceSize: entity[1].resourceSize
          };
        })
      );
    }
  }

  return (
    <div className="third-party-wrapper" style={{ marginLeft: "1em" }}>
      <Table
        id={id}
        headings={thirdPartyHeadings}
        items={thirdPartyItems}
        passData={passData}
        showPagination={selectRef.current.value !== "entity"}
      >
        {children}
        <select
          ref={selectRef}
          className="select-tag"
          onChange={(e) => changeView(e.target.value)}
          style={{ width: "fit-content" }}
        >
          <option value="entity">Entity View</option>
          <option value="script">Script View</option>
        </select>
      </Table>

    </div>
  );
}

export default ThirdPartyTable;
