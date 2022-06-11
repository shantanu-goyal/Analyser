import { Navigate } from "react-router";
import { useContext, useState } from "react";

// Importing the context
import { DataContext } from "../contexts/DataContext";

// Importing the components
import DoughnutChart from "./Graphs/DoughnutChart";
import { NavBar } from "./NavBar";
import Table from "./Table";

// Importing the CSS
import "../styles/Graph.css"


/**
 * Function extracts the round trip time.
 * @param {object} data 
 * @returns {object} - The data containing the rtt for each origin
 */
function extractRTTTime(data) {
  let RTTData = data.items.map(item => {
    return {
      url: item.origin,
      data: item.rtt
    }
  })
  return RTTData;
}



/**
 * Function to generate the graph for the round trip time
 * @param {object} data - The data corresponding to the network RTT
 * @returns {JSX} - The graph corresponding to data 
 */
function generateGraph(data) {
  const details = data.details;
  const timeData = extractRTTTime(details);
  return <DoughnutChart data={timeData} title={"Network RTT"}></DoughnutChart>
}



/**
 * 
 * @returns {JSX} - It renders the Network RTT Component
 */
export default function NetworkRTT() {
  // Extracting the data from the context
  const dataContext = useContext(DataContext);

  // It stores whether the graph should be displayed or not
  const [graph, setGraph] = useState();

  let data = dataContext.data.data;
  data = data['network-rtt'];

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
          <h1 style={{ textAlign: "center" }}>Network RTT</h1>
          <h5 style={{ textAlign: "center" }}>Network Round Trip Times</h5>
          <div className="table-container">
            <Table id={'network-rtt'} headings={data.details.headings} items={data.details.items} passData={passData} />
          </div>
          <div className="graph-container">
            {graph && (generateGraph(data))}
          </div>
        </div>
      )}
    </>

  )
}
