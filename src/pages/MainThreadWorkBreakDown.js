import { useContext, useState } from "react";
import { Navigate } from "react-router";

// Importing the context
import { DataContext } from "../contexts/DataContext";


// Importing the components
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import DoughnutChart from "../components/Graphs/DoughnutChart";

// Importing the CSS
import '../styles/Graph.css'

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
  return <DoughnutChart data={durationData} title={"Main Thread Work Breakdown"} />
}



/**
 * 
 * @returns {JSX} - It renders the Main Thread Work Breakdown Component
 */
export default function MainThreadWorkBreakdown() {
  // Extracting the data from the context
  const dataContext = useContext(DataContext);

  // It stores whether the graph should be displayed or not
  const [graph, setGraph] = useState();

  let data = dataContext.data.data;
  data = data['mainthread-work-breakdown'];


  // This toggles whether the graph should be displayed or not. 
  function passData(data) {
    setGraph(data);
  }

  return (
    <>
      {!data && (
        <Navigate to="/"></Navigate>
      )}
      {data && (<div>
        <NavBar />
        <h1 style={{ textAlign: "center" }}>Main Thread Work Breakdown</h1>
        <h5 style={{ textAlign: "center" }}>Time Devoted by Main-Thread on Various Categories of Works</h5>
        <div className="table-container">
          <Table id={'mainthread-work-breakdown'} headings={data.details.headings} items={data.details.items} passData={passData} />
        </div>
        <div className="graph-container">
          {graph && (generateGraph(data))}
        </div>
      </div>)}
    </>
  )
}
