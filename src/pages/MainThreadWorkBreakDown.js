import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import Graph from "../components/Graphs/Graph";
import '../styles/Graph.css'

/**
 * Function to render the jsx of the main thread work breakdown component
 * @returns {JSX} - It renders the Main Thread Work Breakdown Component
 */
export default function MainThreadWorkBreakdown() {
  // Global data context
  const dataContext = useContext(DataContext);
  // State to store whether the graph should be shown or not.
  const [displayGraph, setDisplayGraph] = useState();
  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data['mainthread-work-breakdown'];

  /**
   * Function extracts the main thread work breakdown time for each group label 
   * @param {object} data 
   * @returns {object} - The data containing all group labels and main thread work breakdown time for each group label
   */
  function extractTotalTime(data) {
    let totalTimeData = data.items.map(item => {
      return {
        url: item.groupLabel,
        data: item.duration
      }
    })
    return totalTimeData;
  }

  /**
   * Function to generate the graph for the main thread work breakdown time
   * 
   * @param {object} data - The data corresponding to the main thread work breakdown time
   * @returns {JSX} - The graph corresponding to data 
   */

  function generateGraph(data) {
    const details = data.details;
    const durationData = extractTotalTime(details);
    return <Graph data={durationData} title={"Main Thread Work Breakdown"} />
  }

  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  return (
    <>
      {!data && (
        <Navigate to="/"></Navigate>
      )}
      {data && (<div>
        <NavBar />
        <h1 style={{ textAlign: "center" }}>Main Thread Work Breakdown</h1>
        <h4 style={{ textAlign: "center" }}> {data.title}  </h4>
          <h6 style={{ textAlign: "center" }}> Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this.  </h6>
        <div className="table-container">
          <Table id={'mainthread-work-breakdown'} headings={data.details.headings} items={data.details.items} passData={passData} />
        </div>
        <div className="graph-container">
          {displayGraph && (generateGraph(data))}
        </div>
      </div>)}
    </>
  )
}
