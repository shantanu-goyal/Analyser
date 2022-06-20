import { Navigate } from "react-router";
import React, { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import Graph from "../components/Graphs/Graph";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import "../styles/Graph.css";

/**
 *  Function to render the jsx of the Network RTT component
 * @returns {JSX} - It renders the Network RTT Component
 */
export default function NetworkRTT() {
  // Gloval data context
  const dataContext = useContext(DataContext);
  // State to store whether the graph should be displayed or not
  const [displayGraph, setDisplayGraph] = useState();
  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data["network-rtt"];

  /**
   * Function extracts the round trip time.
   * @param {object} data
   * @returns {object} - The data containing the rtt for each origin
   */
  function extractRTTTime(data) {
    let RTTData = data.items.map((item) => {
      return {
        url: item.origin,
        data: item.rtt,
      };
    });
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
    return (
      <Graph data={timeData} title={"Network RTT"}></Graph>
    );
  }

  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <div>
          <NavBar />
          <h1 style={{ textAlign: "center" }}>Network RTT</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <h6 style={{ textAlign: "center" }}>
            {" "}
            Network round trip times (RTT) have a large impact on performance.
            If the RTT to an origin is high, its an indication that servers
            closer to the user could improve performance.{" "}
          </h6>
          <div className="table-container">
            <Table
              id={"network-rtt"}
              headings={data.details.headings}
              items={data.details.items}
              passData={passData}
            />
          </div>
          <div className="graph-container">
            {displayGraph && generateGraph(data)}
          </div>
        </div>
      )}
    </>
  );
}
