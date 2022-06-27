import React, { useContext, useState, useRef, useEffect} from "react";
import { Navigate } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import "../styles/Graph.css"
import { generateGraph } from "../utility/networkRequestUtility";
import Title from "../components/Title";
import ThemeButton from "../components/ThemeButton";

/**
 * Function to render the jsx of the network request component
 * @returns {JSX} - It renders the Network Request Component
 */
export default function NetworkRequests() {
  // Global data context
  const dataContext = useContext(DataContext);
  // State to store whether the graph should be displayed or not
  const [displayGraph, setDisplayGraph] = useState();
  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data['network-requests'];

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
      {data && (
        <div>
          <NavBar />
          <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
          </div>
          <Title heading={"Network Requests"} subHeading={data.title}>
            {data.description}
          </Title>
          <div className="table-container">
            <Table id={'network-requests'} headings={data.details.headings} items={data.details.items} passData={passData} />
          </div>
          <div className="graph-container" ref={graphRef}>
            {displayGraph && (generateGraph(data))}
          </div>
        </div>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 883px){
          tr th:nth-child(2),tr td:nth-child(2),
          tr th:nth-child(5),tr td:nth-child(5),
          tr th:nth-child(6),tr td:nth-child(6),
          tr th:nth-child(7),tr td:nth-child(7),
          tr th:nth-child(8),tr td:nth-child(8),
          tr th:nth-child(9),tr td:nth-child(9){
            display:none;
          }
        }
         `
        }}
      />
    </>
  )
}
