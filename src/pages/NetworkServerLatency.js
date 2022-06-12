import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { DataContext } from "../contexts/DataContext";
import DoughnutChart from "../components/Graphs/DoughnutChart";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import "../styles/Graph.css"


/**
 *  Function to render the jsx of the Network Server Latency component
 * @returns {JSX} - It renders the Network Server Latency Component
 */
export default function NetworkServerLatency() {
  // Global data context
  const dataContext = useContext(DataContext);
  // State to store whether the graph should be displayed or not
  const [displayGraph, setDisplayGraph] = useState();
  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data['network-server-latency'];

  /**
   * Function extracts the network server latency time.
   * @param {object} data 
   * @returns {object} - The data containing the network server latency time for each origin
   */
  function extractNetworkServerLatencyTime(data) {
    let totalTimeData = data.items.map(item => {
      return {
        url: item.origin,
        data: item.serverResponseTime
      }
    })
    return totalTimeData;
  }

  /**
   * Function to generate the graph for the network server latency time
   * @param {object} data - The data corresponding to the network server latency time
   * @returns {JSX} - The graph corresponding to data 
   */
  function generateGraph(data) {
    const details = data.details;
    const latencyTime = extractNetworkServerLatencyTime(details);
    return (<DoughnutChart data={latencyTime} title={"Network Server Latency"} />)
  }

  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }


  return (
    <>
      {!data && (<Navigate to="/" />)}
      {data && (
        <div>
          <NavBar />
          <h1 style={{ textAlign: "center" }}>Network Server Latency</h1>
          <h5 style={{ textAlign: "center" }}>Server Backend Latencies</h5>
          <div className="table-container">
            <Table id={'network-server-latency'} headings={data.details.headings} items={data.details.items} passData={passData} />
          </div>
          <div className="graph-container">
            {displayGraph && (generateGraph(data))}
          </div>
        </div>
      )}
    </>
  )
}
