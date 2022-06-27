import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from 'react-router-dom';
import Button from "../components/Button";
import Pie from "../components/Graphs/Pie";
import Modal from "../components/Modal";
import { NavBar } from "../components/NavBar";
import Select from "../components/Select";
import Table from "../components/Table";
import ThemeButton from "../components/ThemeButton";
import ThirdPartyTable from '../components/ThirdPartyTable';
import Title from "../components/Title";
import { DataContext } from "../contexts/DataContext";
import "../styles/ThirdPartySummary.css";
import { generateGraph, getHostname } from '../utility/thirdPartyUtility';
/**
 * 
 * @returns JSX for Third Party Summary Component
 */
export default function ThirdPartySummary() {

  //Global data context
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data["third-party-summary"];
  let allData = dataContext.data.thirdParty;
  let thirdPartyData = dataContext.data.thirdPartySummary;
  let details = data.details || {};
  // Getting data from the context
  const userData = thirdPartyData.userInput;
  const domainWiseScripts = thirdPartyData.domainScripts;
  const thirdPartyScripts = thirdPartyData.thirdPartyScripts;

  // Setting the data from the context in the state
  const [userInput, setUserInput] = useState(userData);
  const [dropdownScripts, setDropdownScripts] = useState(domainWiseScripts);
  const [thirdPartyScriptsArray, setThirdPartyScriptsArray] = useState(thirdPartyScripts);
  const [itemState, setItemState] = useState(getItemState(thirdPartyScripts));

  // Reference to key field for new URL
  const keyRef = useRef(null);

  // Reference to value field for new Entity
  const valueRef = useRef(null);

  // State to store whether the graph should be shown or not.
  const [displayGraph, setDisplayGraph] = useState();
  const [summaryGraph, setSummaryGraph] = useState();

  /* State to store the type of the graph to be generated. Defaults to the main thread time graph.*/
  const [value, setValue] = useState("mainthread");
  const [graphValue, setGraphValue] = useState('mainthread');
  const graphRef = useRef(null)
  useEffect(() => {
    if (displayGraph) graphRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }, [displayGraph])
  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  function thirdPartySummaryGraphToggle(data){
    setSummaryGraph(data);
  }

  // This function is fired whenever a different type of graph is requested and it sets the value of the type of graph requested in the state
  function changeHandler(e) {
    setValue(e.target.value);
  }

  function graphChange(e) {
    setGraphValue(e.target.value);
  }

  function getItemState(thirdParty) {
    let thirdPartyScripts = {
      url: "Third Party",
      mainThreadTime: 0,
      blockingTime: 0,
      resourceSize: 0,
      transferSize: 0
    }

    let allScripts = {
      url: "All",
      mainThreadTime: 0,
      blockingTime: 0,
      resourceSize: 0,
      transferSize: 0
    }

    let domainSpecificScripts = {
      url: "Domain Specific",
      mainThreadTime: 0,
      blockingTime: 0,
      resourceSize: 0,
      transferSize: 0
    }

    let items = details.items || [];
    items.map(item => {
      allScripts.mainThreadTime += item.mainThreadTime;
      allScripts.blockingTime += item.blockingTime;
      allScripts.transferSize += item.transferSize;
      allScripts.resourceSize += item.resourceSize;
      return {};
    })

    thirdParty.map(script => {
      thirdPartyScripts.blockingTime += script.blockingTime;
      thirdPartyScripts.mainThreadTime += script.mainThreadTime;
      thirdPartyScripts.resourceSize += script.resourceSize;
      thirdPartyScripts.transferSize += script.transferSize;
      return {};
    })

    domainSpecificScripts.mainThreadTime = allScripts.mainThreadTime - thirdPartyScripts.mainThreadTime;
    domainSpecificScripts.blockingTime = allScripts.blockingTime - thirdPartyScripts.blockingTime;
    domainSpecificScripts.transferSize = allScripts.transferSize - thirdPartyScripts.transferSize;
    domainSpecificScripts.resourceSize = allScripts.resourceSize - thirdPartyScripts.resourceSize;

    return [thirdPartyScripts, domainSpecificScripts];
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
    setItemState(getItemState(thirdPartyScripts));
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

  function renderGraph() {
    let data;
    if (graphValue === "mainthread") {
      data = itemState.map(item => {
        return {
          data: item.mainThreadTime,
          url: item.url
        }
      })
    }
    else if (graphValue === 'blocking') {
      data = itemState.map(item => {
        return {
          data: item.blockingTime,
          url: item.url
        }
      })
    }
    else if (graphValue === 'transfer') {
      data = itemState.map(item => {
        return {
          data: item.transferSize / 1024,
          url: item.url
        }
      })
    }
    else {
      data = itemState.map(item => {
        return {
          data: item.resourceSize / 1024,
          url: item.url
        }
      })
    }
    return data;
  }

  function addKey(e, index, value) {
    setUserInput([
      ...userInput.slice(0, index),
      { key: e.target.value, value },
      ...userInput.slice(index + 1),
    ]);
  }

  function addValue(e, index, key) {
    setUserInput([
      ...userInput.slice(0, index),
      { key, value: e.target.value },
      ...userInput.slice(index + 1),
    ]);
  }





  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <>
          <NavBar />
          <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
          </div>
          {data.details ? (
            <div>
              <Title heading={"Third Party Summary"} subHeading={data.title} >
                Third-party code can significantly impact load performance.
                Limit the number of redundant third-party providers and try to
                load third-party code after your page has primarily finished
                loading
              </Title>
              <ThirdPartyTable
                id={"third-party-summary"}
                scripts={thirdPartyScriptsArray}
                userInput={userInput}
                domainWiseScripts={dropdownScripts}
                passData={passData}
              >
                <Modal name={"Update Entities"} >
                  <table className="entity-input">
                    <thead>
                      <tr>
                        <th>URL</th>
                        <th>ENTITY NAME</th>
                        <th>ACTION</th>
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
                                  addKey(e, index, value);
                                }}
                                spellCheck="false"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => {
                                  addValue(e, index, key);
                                }}
                                spellCheck="false"
                              />
                            </td>
                            <td>
                              <Button
                                style={{ color: "red", border: "1px solid red", padding: "0.5em", borderRadius: "0px" }}
                                onClick={
                                  (e) => {
                                    onRemove(index);
                                  }
                                }
                              >
                                Remove
                              </Button>
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
                            {dropdownScripts.map(script => {
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
                          <Button
                            style={{ color: "green", border: "1px solid green", padding: "0.5em", borderRadius: "0px" }}
                            onClick={onAdd}>Add</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Modal>
              </ThirdPartyTable>
              <h2 style={{ textAlign: "center", marginTop: "1em",color:"var(--color-text)" }}>Summary View</h2>
              <div className="table-container ml-1">
                <Table id={'summary-thirdparty-table'}  showPagination={false}
                passData={thirdPartySummaryGraphToggle}
                  headings={[
                    { key: "url", text: "Summary", itemType: "text" },
                    { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
                    { key: "blockingTime", text: "Main Thread Blocking Time", itemType: "ms" },
                    { key: "resourceSize", text: "Resource Size", itemType: "bytes" },
                    { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
                  ]}
                  items={itemState}
                />
              </div>

              {summaryGraph && (
                <div className="table-container">
                <Select
                  value={graphValue}
                  onChange={graphChange}
                >
                  <option value="mainthread">Main Thread Time</option>
                  <option value="blocking">Main Thread Blocking Time</option>
                  <option value="transfer">Transfer Size</option>
                  <option value="resource">Resource Size</option>
                </Select>
                <div className="big-pie graph-inner-container">
                  <Pie data={renderGraph()} title={'Domain Specific Scripts vs Third Party Scirpts'} />
                </div>
              </div>
              )}

              <div className="graph-container" ref={graphRef}>
                {displayGraph && (
                  <>
                    <div className="table-container">
                      <Select
                        value={value}
                        onChange={changeHandler}
                      >
                        <option value="mainthread">Main Thread Time</option>
                        <option value="blocking">Main Thread Blocking Time</option>
                        <option value="transfer">Transfer Size</option>
                        <option value="resource">Resource Size</option>
                      </Select>
                    </div>

                    {generateGraph(thirdPartyScriptsArray, value)}
                  </>
                )}
              </div>
            </div>
          ) : (
            <h2 style={{ textAlign: "center" }}> Nothing to show here... </h2>
          )}
        </>
      )}

    </>
  );
}
