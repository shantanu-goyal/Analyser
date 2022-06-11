import { useContext, useState } from "react";
import { Navigate } from "react-router";

// Importing the context
import { DataContext } from "../contexts/DataContext";

// Importing the components
import { NavBar } from "./NavBar";
import Table from "./Table";
import DoughnutChart from "./Graphs/DoughnutChart";

// Importing the CSS
import "../styles/Graph.css"


/**
 * Function extracts the total duration of network requests for each network request
 * @param {object} data 
 * @returns {object} - The data containing all network requests and total duration of network requests for each network request
 */
function extractDurationTime(data) {

  let durationTimeData = data.items.map(item => {
    // We return the data only if a network request has successfully finished
    if (item.finished) {
      return {
        url: item.url,
        // The duration is the difference between the startTime and the endTime
        data: item.endTime - item.startTime
      }
    }
    return {}
  }).filter(value => Object.keys(value).length !== 0);
  // Before returning the data, we filter out the empty objects
  return durationTimeData;
}



/**
 * Function to generate the graph for the total duration of different network requests 
 * @param {object} data - The data corresponding to the network requests
 * @returns {JSX} - The graph corresponding to data 
 */

function generateGraph(data) {
  const details = data.details;
  const durationTimeData = extractDurationTime(details);
  return <DoughnutChart data={durationTimeData} title={"Durartion of Network Requests"} />
}




/**
 * 
 * @returns {JSX} - It renders the Network Request Component
 */
export default function NetworkRequests() {

  // Extracting the data from the context
  const dataContext = useContext(DataContext);

  // It stores whether the graph should be displayed or not
  const [graph, setGraph] = useState();

  let data = dataContext.data.data;
  data = data['network-requests'];


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
          <h1 style={{ textAlign: "center" }}>Network Requests</h1>
          <h5 style={{ textAlign: "center" }}>Network Requests Made by Main-Thread</h5>
          <div className="table-container">
            <Table id={'network-requests'} headings={data.details.headings} items={data.details.items} passData={passData} />
          </div>
          <div className="graph-container">
            {graph && (generateGraph(data))}
          </div>
        </div>
      )}
    </>

  )
}
