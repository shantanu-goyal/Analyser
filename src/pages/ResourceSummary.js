import React, { useContext, useState, useRef, useEffect } from "react";
import { Navigate } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import "../styles/Graph.css"
import { generateGraph } from "../utility/resourceSummaryUtility";
import Title from "../components/Title";

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

  const graphRef = useRef(null)
  useEffect(() => {
    if(displayGraph)graphRef.current.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }, [displayGraph])
  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  return (
    <>
      {!data && (<Navigate to="/" />)}
      {data && (<div>
        <NavBar />
        <Title heading={"Resource Summary"} subHeading={data.title} />
        <div className="table-container">
          <Table id={'resource-summary'} headings={data.details.headings} items={data.details.items} passData={passData} />
        </div>
        <div className="graph-container" ref={graphRef}>
          {displayGraph && (generateGraph(data))}
        </div>
      </div>)}
    </>
  )
}
