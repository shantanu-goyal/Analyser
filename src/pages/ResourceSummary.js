import React, { useContext, useState } from "react";
import { Navigate } from "react-router";

// Importing the context 
import { DataContext } from "../contexts/DataContext";

// Importing the components
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import DoughnutChart from '../components/Graphs/DoughnutChart'

// Importing the CSS
import "../styles/Graph.css"


/**
 * Function extracts the transfer size for each group label.
 * @param {object} data 
 * @returns {object} - The data containing the transfer size for each group label.
 */
function extractTransferSize(data) {
  let transferSizeData = data.items.map(item => {
    return {
      url: item.label,
      data: item.transferSize
    }
  })
  return transferSizeData;
}

/**
 * 
 * @param {object} data - The data corresponding to the transfer size.
 * @returns {JSX} - The graph corresponding to data.
 */
function generateGraph(data) {
  const details = data.details;
  const transferSizeData = extractTransferSize(details);
  return (<DoughnutChart data={transferSizeData} title={"Resource Summary"} />)
}


export default function ResourceSummary() {
  // Extracting the data from the context
  const dataContext = useContext(DataContext);

  // It stores whether the graph should be displayed or not
  const [graph, setGraph] = useState();

  let data = dataContext.data.data;
  data = data['resource-summary'];


  // This toggles whether the graph should be displayed or not. 
  function passData(data) {
    setGraph(data);
  }

  return (
    <>
      {!data && (<Navigate to="/" />)}
      {data && (<div>
        <NavBar />
        <h1 style={{ textAlign: "center" }}>Resource Summary</h1>
        <h5 style={{ textAlign: "center" }}>Request Counts And Transfer Size of Various Types of Resources</h5>
        <div className="table-container">
          <Table id={'resource-summary'} headings={data.details.headings} items={data.details.items} passData={passData} />
        </div>
        <div className="graph-container">
          {graph && (generateGraph(data))}
        </div>
      </div>)}
    </>

  )
}
