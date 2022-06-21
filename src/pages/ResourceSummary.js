import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import Graph from '../components/Graphs/Graph'
import "../styles/Graph.css"


/**
 *  Function to render the jsx of the Resource Summary component
 * @returns {JSX} - It renders the Resource Summary Component
 */
export default function ResourceSummary() {
  // Global data context
  const dataContext = useContext(DataContext);
  // State to store whether the graph should be displayed or not
  const [displayGraph, setDisplayGraph] = useState();
  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data['resource-summary'];

  /**
   * Function extracts the transfer size for each group label.
   * @param {object} data 
   * @returns {object} - The data containing the transfer size for each group label.
   */
  function extractTransferSize(data) {
    let transferSizeData = data.items.map(item => {
      return {
        url: item.label,
        data: item.transferSize/1024
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
    return (<Graph data={transferSizeData} title={"Resource Summary"} />)
  }

  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  return (
    <>
      {!data && (<Navigate to="/" />)}
      {data && (<div>
        <NavBar />
        <h1 style={{ textAlign: "center" }}>Resource Summary</h1>
        <h4 style={{ textAlign: "center" }}> {data.title}  </h4>
        <div className="table-container">
          <Table id={'resource-summary'} headings={data.details.headings} items={data.details.items} passData={passData} />
        </div>
        <div className="graph-container">
          {displayGraph && (generateGraph(data))}
        </div>
      </div>)}
    </>
  )
}
