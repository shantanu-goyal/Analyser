import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import ThemeButton from "../components/ThemeButton";
import Title from "../components/Title";
import { DataContext } from "../contexts/DataContext";
import '../styles/Graph.css';
import { generateGraph } from "../utility/mainThreadUtility";
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
      {!data && (
        <Navigate to="/"></Navigate>
      )}
      {data && (<div>
        <NavBar />
        <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
        </div>
        <Title heading={"Main Thread Work Breakdown"} subHeading={data.title}>
          Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this.
        </Title>
        <div className="table-container">
          <Table id={'mainthread-work-breakdown'} headings={data.details.headings} items={data.details.items} passData={passData} />
        </div>
        <div className="graph-container" ref={graphRef}>
          {displayGraph && (generateGraph(data))}
        </div>
      </div>)}
    </>
  )
}
