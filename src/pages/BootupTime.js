import React, { useContext, useState } from "react";
import { Navigate } from 'react-router-dom'

// Importing the context
import { DataContext } from "../contexts/DataContext";

// Importing the components
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import DoughnutChart from "../components/Graphs/DoughnutChart";

// Importing the CSS
import "../styles/Graph.css"

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
  const details = data.details;

  const total = extractTotalTime(details);
  const evaluation = extractScriptEvaluationTime(details);
  const parsing = extractScriptParsingTime(details);

  if (value === "total") {
    return <DoughnutChart title={"Total CPU Time"} data={total}></DoughnutChart>
  }
  else if (value === "script-parsing") {
    return <DoughnutChart title={"Script Parsing Time"} data={parsing}></DoughnutChart>
  }
  else {
    return <DoughnutChart title={"Script Evaluation Time"} data={evaluation} />
  }
}




/**
 * 
 * @returns {JSX} - It renders the Bootup Time Component
 */
export default function BootupTime() {
  // It stores whether the graph should be displayed or not
  const [graph, setGraph] = useState();

  // The default type of graph generated will be of Total CPU Time
  const [value, setValue] = useState("total");

  const dataContext = useContext(DataContext);

  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data['bootup-time'];


  // This function is fired whenever a different type of graph is requested and it sets the value of the type of graph requested in the state
  function changeHandler(e) {
    setValue(e.target.value);
  }

  // This toggles whether the graph should be displayed or not. 
  function passData(data) {
    setGraph(data);
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
          <h5 style={{ textAlign: "center" }}> Scripts With Execution Time Greater Than or Equal to 50ms  </h5>

          <div className="table-container">

            <Table id={'bootup-time'} headings={data.details.headings} items={data.details.items} passData={passData} />

          </div>
          <div className="graph-container">
            {graph && (
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
