import React, { useContext, useState, useRef, useEffect } from "react";
import { Navigate } from 'react-router-dom'
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import "../styles/Graph.css"
import { generateGraph } from "../utility/bootupTImeUtility";
import Select from "../components/Select";
import Title from "../components/Title";
import ThemeButton from '../components/ThemeButton';
/**
 * Function to render the jsx of the bootup time component
 * @returns {JSX} - It renders the Bootup Time Component
 */
export default function BootupTime() {
  // State to store whether the graph should be shown or not.
  const [displayGraph, setDisplayGraph] = useState();
  // State to store the type of the graph to be generated. Defaults to the total CPU time graph.
  const [value, setValue] = useState("total");
  // The Global data context
  const dataContext = useContext(DataContext);
  // Extracting the data from the context
  let data = dataContext && dataContext.data && dataContext.data.data;
  data = data && data['bootup-time'];

  const graphRef = useRef(null)
  useEffect(() => {
    if(displayGraph)graphRef.current.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }, [displayGraph])
  // This function is fired whenever a different type of graph is requested and it sets the value of the type of graph requested in the state
  function changeHandler(e) {
    setValue(e.target.value);
  }
  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  return (
    <>
      {/* If data is not available, the user is redirected to the home page */}
      {!data && (
        <Navigate to="/"></Navigate>
      )}

      {data && (
        <div>
          <NavBar />
          <div style={{position:"absolute",right:"0"}}>
            <ThemeButton>Toggle Dark Mode</ThemeButton>
          </div>
        
          <Title heading={"Bootup Time"} subHeading={data.title}>
            Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this.
          </Title>
          <div className="table-container">
            <Table id={'bootup-time'} headings={data.details.headings} items={data.details.items.filter(({url}) => url !== 'Unattributable')} passData={passData} />

          </div>
          <div className="graph-container" ref={graphRef}>
            {displayGraph && (
              <>
                <Select value={value} onChange={changeHandler} style={{ marginTop: "2em" }}>
                  <option value="total">Total CPU Time</option>
                  <option value="script-evaluation">Script Evaluation Time</option>
                  <option value="script-parsing">Script Parsing Time</option>
                </Select>
                {generateGraph(data, value)}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
