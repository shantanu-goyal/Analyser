import { useContext, useState } from "react";
import { Navigate } from "react-router";

// Importing the context
import { DataContext } from "../contexts/DataContext";

// Importing the components
import DoughnutChart from "./Graphs/DoughnutChart";
import { NavBar } from "./NavBar";
import Table from "./Table";

// Importing the CSS
import "../styles/Graph.css"



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


/**
 * 
 * @returns {JSX} - It renders the Network Server Latency Component
 */
export default function NetworkServerLatency() {
  // Extracting the data from the context
  const dataContext = useContext(DataContext);

  // It stores whether the graph should be displayed or not
  const [graph, setGraph] = useState();

  let data = dataContext.data.data;
  data = data['network-server-latency'];

  // This toggles whether the graph should be displayed or not. 
  function passData(data) {
    setGraph(data);
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
            {graph && (generateGraph(data))}
          </div>
        </div>
      )}
    </>
  )
}
