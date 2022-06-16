import React, { useContext, useState, useRef } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import ThirdPartyTable from '../components/ThirdPartyTable'
import { thirdPartyWeb } from '../utility/third-party-web/entity-finder-api'
import { getHostname, generateGraph } from '../utility/thirdPartyUtility';
import { Navigate } from 'react-router-dom';
import "../styles/ThirdPartySummary.css"


/**
 * 
 * @returns JSX for Third Party Summary Component
 */
export default function ThirdPartySummary() {

  //Global data context
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data["third-party-summary"];
  
  // Reference to key field for new URL
  const keyRef = useRef(null);
  
  // Reference to value field for new Entity
  const valueRef = useRef(null);
  
  // State to store whether the graph should be shown or not.
  const [displayGraph, setDisplayGraph] = useState();
  
  /* State to store the type of the graph to be generated. Defaults to the main thread time graph.*/
  const [value, setValue] = useState("mainthread");

  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  // This function is fired whenever a different type of graph is requested and it sets the value of the type of graph requested in the state
  function changeHandler(e) {
    setValue(e.target.value);
  }

  // Getting data from the context
  const {entities, scripts, thirdPartyScripts,mapping, domainWiseScripts}=dataContext.data.thirdParty;
  const userData = dataContext.data.thirdParty.userInput;

  // Setting the data from the context in the state
  const [userInput, setUserInput] = useState(userData);
  const [entityArray, setEntityArray] = useState(entities);
  const [scriptsArray, setScriptsArray] = useState(scripts);
  const [thirdPartyScriptsArray, setThirdPartyScriptsArray] = useState(thirdPartyScripts);
  const [mappingArray, setMappingArray] = useState(mapping);
  const [dropdownScripts, setDropdownScripts] = useState(domainWiseScripts);



  /**
   * Function to render the table.
   * 
   * @param {Array} newUserInput - The updated user selection array
   * 
   */  
  function renderTable(newUserInput) {
    /* Map that stores the entity name along with its corresponding main thread time, blocking time and transfer size. */
    const byEntity = new Map();

    /* Map to store scripts for each entity name*/
    const entityWiseScripts = new Map();
    
    /* Array containing all the scripts */
    const scripts = scriptsArray;
    
    /* Array containing only third party scripts */
    const thirdPartyScripts = [];
    
    
    scripts.forEach(script => {
      // Extracting the hostname for the url of the script
      let scriptURL = getHostname(script.url);
      
      // If URL is invalid, return
      if (!scriptURL) {
        return;
      }

      // Check if the hostname is in the third party web database
      let entity = thirdPartyWeb.getEntity(scriptURL);

      /* If entity is not present in the database check if it is provided by the user */
      if (!entity) {

        entity = newUserInput.find(entity => getHostname(entity.key) === scriptURL);
        // If entity is found, update the entity
        if (entity) {
          entity = { name: entity.value };
        }
      }
    
      let scriptData = script.data;
      const defaultConfig = {
        mainThreadTime: 0,
        blockingTime: 0,
        transferSize: 0
      }
      if (entity) {
        // Push the current script in the third party script array
        thirdPartyScripts.push(script);
        
        /* Check if the entity was previously present in our map*/
        const currentEntity = byEntity.get(entity.name) || { ...defaultConfig };

        /* Get the scripts array for the particular entity */
        const scriptForEntity = entityWiseScripts.get(entity.name) || [];
        
        // Push the current URL in the script array for that particular entity
        scriptForEntity.push(script.url);
        
        // Update the scripts array in the map
        entityWiseScripts.set(entity.name, scriptForEntity);

        // Update the metrics of the entity
        currentEntity.mainThreadTime += scriptData.mainThreadTime;
        currentEntity.blockingTime += scriptData.blockingTime;
        currentEntity.transferSize += scriptData.transferSize;

        // Set the newly updated metrics in the entity map
        byEntity.set(entity.name, currentEntity);
      }
    })
    const entities = Array.from(byEntity.entries());
    const mapping = Array.from(entityWiseScripts.entries());
    // Set the updated mappings array in the state
    setMappingArray(mapping);
    // Set the updated entity array in the state
    setEntityArray(entities);
    // Set the updated third party array in the state
    setThirdPartyScriptsArray(thirdPartyScripts);
  }


  /**
   * Event Handler for the add button
   */
  function onAdd() {
    // Extract the key, value pair
    const key = keyRef.current.value;
    const value = valueRef.current.value;
    
    // Error Handling
    if (!key || !value || userInput.find((ip) => ip.key === key)) {
      alert('Invalid Entry');
      return;
    }
    
    // Update the user input array. Add the new key-value pair
    const newUserInput = [...userInput, { key, value }];

    // Set the new user input array in the current state
    setUserInput(newUserInput);
    
    // Render the table
    renderTable(newUserInput);
    
    // Update the dropdown menu
    const hostname = getHostname(key);
    setDropdownScripts(dropdownScripts.filter(script => {
      return script !== hostname;
    }))
    
    keyRef.current.value = "";
    valueRef.current.value = "";
  }

  /**
   * Function for the remove button 
   * 
   * @param {Number} index - Index of the current data in the user input array
   * @returns 
   */
  function onRemove(index) {
    
    // Update the user input array
    const newUserInput = [...userInput.slice(0, index), ...userInput.slice(index + 1)];
    setUserInput(newUserInput);
    
    // Render the table 
    renderTable(newUserInput);
    
    // Update the dropdown
    const hostname = getHostname(userInput[index].key);
    if (!hostname) {
      return;
    }
    setDropdownScripts([...dropdownScripts, hostname]);
  }


  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <div>
          <NavBar />
          {data.details ? (
            <>
              <h1 style={{ textAlign: "center" }}>Third Party Summary</h1>
              <h4 style={{ textAlign: "center" }}> {data.title} </h4>
              <h6 style={{ textAlign: "center" }}>
                {" "}
                Third-party code can significantly impact load performance.
                Limit the number of redundant third-party providers and try to
                load third-party code after your page has primarily finished
                loading.{" "}
              </h6>
              <div className="table-container">
                <ThirdPartyTable
                  id={"third-party-summary"}
                  all={scriptsArray}
                  scripts={thirdPartyScriptsArray}
                  userInput={userInput}
                  entities={entityArray}
                  mapping={mappingArray}
                  domainWiseScripts={dropdownScripts}
                  passData={passData}
                />
                <h1>Add your own entities below:-</h1>
                <table className="entity-input">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>ENTITY NAME</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {userInput.map(({ key, value }, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              value={key}
                              onChange={(e) => {
                                setUserInput([
                                  ...userInput.slice(0, index),
                                  { key: e.target.value, value },
                                  ...userInput.slice(index + 1),
                                ]);
                              }}
                              spellCheck="false"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => {
                                setUserInput([
                                  ...userInput.slice(0, index),
                                  { key, value: e.target.value },
                                  ...userInput.slice(index + 1),
                                ]);
                              }}
                              spellCheck="false"
                            />
                          </td>
                          <td>
                            <img
                              src="remove.png"
                              alt="Remove"
                              onClick={
                                (e) => {
                                  onRemove(index);
                                }
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td>
                        <select className='entity-select'
                          ref={keyRef}
                          placeholder="Key"
                        >
                          {dropdownScripts.map((script, idx) => {
                            return <option key={idx} value={"https://" + script}>{script}</option>
                          })}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          ref={valueRef}
                          placeholder="Value"
                          spellCheck="false"
                        />
                      </td>
                      <td>
                        <img src="add.png" alt="Add" onClick={onAdd} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="graph-container">
                {displayGraph && (
                  <>
                    <h1>Graph:-</h1>
                    <select
                      value={value}
                      onChange={changeHandler}
                      style={{ marginTop: "2em" }}
                    >
                      <option value="mainthread">Main Thread Time</option>
                      <option value="blocking">Render Blocking Time</option>
                    </select>
                    {generateGraph(thirdPartyScriptsArray, value)}
                  </>
                )}
              </div>
            </>
          ) : (
            <h2 style={{ textAlign: "center" }}> Nothing to show here... </h2>
          )}
        </div>
      )}
    </>
  );
}
