import React, { useContext, useState } from "react";
import { Navigate } from 'react-router-dom'
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import "../styles/Graph.css"
import Bar from "../components/Graphs/Bar";


/**
 * Function to render the jsx of the bootup time component
 * @returns {JSX} - It renders the Bootup Time Component
 */
export default function BootupTime() {
  // State to store whether the graph should be shown or not.
  const [displayGraph, setDisplayGraph] = useState();
  // State to store the type of the graph to be generated. Defaults to the total CPU time graph.
  const [value, setValue] = useState("total");
  // The Global data context
  const dataContext = useContext(DataContext);
  console.log(dataContext);
  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data['bootup-time'];

  /**
   * Function to extract the total CPU time corresponding to each url from the data 
   * @param {object} data
   * @returns {object} - The data containing all urls and total CPU time corresponding to each url
   */
  function extractTotalTime(data) {
    let totalTimeData = data.items.map(item => {
      return {
        url: item.url,
        data: item.total
      }
    })
    return totalTimeData;
  }

  /**
   * Function to extract the total script evaluation time corresponding to each url from the data 
   * @param {object} data
   * @returns {object} - The data containing all urls and total script evaluation time corresponding to each url
   */
  function extractScriptEvaluationTime(data) {
    let scriptEvaluationTimeData = data.items.map(item => {
      return {
        url: item.url,
        data: item.scripting
      }
    })
    return scriptEvaluationTimeData;
  }

  /**
   * Function to extract the total script parsing time corresponding to each url from the data 
   * @param {object} data
   * @returns {object} - The data containing all urls and total scirpt parsing time corresponding to each url
   */
  function extractScriptParsingTime(data) {
    let scriptParsingTimeData = data.items.map(item => {
      return {
        url: item.url,
        data: item.scriptParseCompile
      }
    })
    return scriptParsingTimeData;
  }

  /**
   * Function to generate the graph for the bootup time
   * 
   * @param {object} data - The data corresponding to the bootup time
   * @param {string} value - The type of the graph to be generated
   * @returns {JSX} - The graph corresponding to the type of the graph requested by the user
   */

  function generateGraph(data, value) {
    // Extracting the details from the data
    const details = data.details;
    const total = extractTotalTime(details);
    const evaluation = extractScriptEvaluationTime(details);
    const parsing = extractScriptParsingTime(details);
    // User requests the total CPU time graph
    if (value === "total") {
      return <Bar title={"Total CPU Time"} data={total}></Bar>
    }
    // User requests the script parsing time graph
    else if (value === "script-parsing") {
      return <Bar title={"Script Parsing Time"} data={parsing}></Bar>
    }
    // User requests the script evaluation time graph
    else {
      return <Bar title={"Script Evaluation Time"} data={evaluation} />
    }
  }

  // This function is fired whenever a different type of graph is requested and it sets the value of the type of graph requested in the state
  function changeHandler(e) {
    setValue(e.target.value);
  }
  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  return (
    <>
      {/* If data is not available, the user is redirected to the home page */}
      {!data && (
        <Navigate to="/"></Navigate>
      )}

      {data && (
        <div>
          <NavBar />

          <h1 style={{ textAlign: "center" }}>Bootup Time</h1>
          <h4 style={{ textAlign: "center" }}> {data.title}  </h4>
          <h6 style={{ textAlign: "center" }}> Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this. </h6>
          <div className="table-container">

            <Table id={'bootup-time'} headings={data.details.headings} items={data.details.items.filter(({url}) => url !== 'Unattributable')} passData={passData} />

          </div>
          <div className="graph-container">
            {displayGraph && (
              <>
                <select value={value} onChange={changeHandler} style={{ marginTop: "2em" }}>
                  <option value="total">Total CPU Time</option>
                  <option value="script-evaluation">Script Evaluation Time</option>
                  <option value="script-parsing">Script Parsing Time</option>
                </select>
                {generateGraph(data, value)}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
