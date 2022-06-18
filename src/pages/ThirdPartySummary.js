import React, { useContext, useState, useRef } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import ThirdPartyTable from '../components/ThirdPartyTable'
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
  let allData = dataContext.data.thirdParty;
  let thirdPartyData = dataContext.data.thirdPartySummary;

  // Getting data from the context
  const userData = thirdPartyData.userInput;
  const domainWiseScripts = thirdPartyData.domainScripts;
  const thirdPartyScripts = thirdPartyData.thirdPartyScripts;

  // Setting the data from the context in the state
  const [userInput, setUserInput] = useState(userData);
  const [dropdownScripts, setDropdownScripts] = useState(domainWiseScripts);
  const [thirdPartyScriptsArray, setThirdPartyScriptsArray] = useState(thirdPartyScripts);

  console.log(dropdownScripts);

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




  /**
   * Function to render the table.
   * 
   * @param {Array} newUserInput - The updated user selection array
   * 
   */
  function renderTable(newUserInput) {
    // Get all the thirdParty data
    let data = allData;
    // Initialise Third Party Scripts
    let thirdPartyScripts = [];
    // Initialise Domain Specific Scripts
    data.map(item => {
      // If third party
      if (item.entityName) {
        thirdPartyScripts = [...thirdPartyScripts, ...item.subItems.items]
      }
      else {
        const entity = newUserInput.filter(data => {
          if (getHostname(data.key) === item.entity.url) {
            return true;
          }
          return false;
        })
        if (entity.length > 0) {
          thirdPartyScripts = [...thirdPartyScripts, ...item.subItems.items];
        }
      }
      return {};
    });

    thirdPartyScripts = thirdPartyScripts.filter(script => {
      return typeof (script.url) === "string";
    });

    // Set the new user input to the current state
    setUserInput(newUserInput);
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
                  scripts={thirdPartyScriptsArray}
                  userInput={userInput}
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
                        {dropdownScripts.map(script=>{
                          return <option key={script} value={"https://" + script}>{script}</option>
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
                      <option value="blocking">Main Thread Blocking Time</option>
                      <option value="transfer">Transfer Size</option>
                      <option value="resource">Resource Size</option>
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
