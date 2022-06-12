import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import ThirdPartyTable from "../components/ThirdPartyTable";
import DoughnutChart from "../components/Graphs/DoughnutChart";
import "../styles/Graph.css"


export default function ThirdPartySummary() {
  // State to store whether the graph should be shown or not.
  const [displayGraph, setDisplayGraph] = useState();
  // State to store the type of the graph to be generated. Defaults to the main thread time graph.
  const [value, setValue] = useState("mainthread");
  // Global data context
  const dataContext = useContext(DataContext);
  // Extracting the data from the context
  let data = dataContext.data.data;
  data = data['third-party-summary'];

  /**
   * Function to extract the main thread running time corresponding to each url from the data
   * 
   * @param {object} data 
   * @returns {object} - The data containing all urls and main thread running time corresponding to each url
   */
  function extractMainThreadTime(data) {
    let mainThreadTimeData = data.items.map(item => {
      const subItemData = item.subItems.items.map(subitem => {
        return {
          url: subitem.url,
          data: (subitem.mainThreadTime === undefined) ? 0 : subitem.mainThreadTime
        }
      })
      return subItemData;
    }).filter(element => {
      // We filter out the empty arrays
      if (Object.keys(element).length !== 0) {
        return true;
      }
      return false;
    });

    // We flatten the array and combine data from multiple arrays into a single array of objects
    mainThreadTimeData = [...mainThreadTimeData];
    let finalAns = []
    for (let i = 0; i < mainThreadTimeData.length; i++) {
      finalAns.push(...mainThreadTimeData[i]);
    }
    // We filter out the elements with 0 time
    return finalAns.filter(element => {
      if (element.data > 0) {
        return true;
      }
      return false;
    });
  }

  /**
   * Function to extract the main thread blocking time
   * 
   * @param {object} data 
   * @returns {object} - The data containing all urls and main thread blocking time corresponding to each url
   */
  function extractBlockingTime(data) {
    let blockingTimeData = data.items.map(item => {
      const subItemData = item.subItems.items.map(subitem => {
        return {
          url: subitem.url,
          data: (subitem.blockingTime === undefined) ? 0 : subitem.blockingTime
        }
      })
      return subItemData;
    }).filter(element => {
      // We filter out the empty arrays
      if (Object.keys(element).length !== 0) {
        return true;
      }
      return false;
    });
    // We flatten the array and combine data from multiple arrays into a single array of objects
    blockingTimeData = [...blockingTimeData];
    let finalAns = []
    for (let i = 0; i < blockingTimeData.length; i++) {
      finalAns.push(...blockingTimeData[i]);
    }
    return finalAns.filter(element => {
      // We filter out the elements with 0 time
      if (element.data > 0) {
        return true;
      }
      return false;
    });
  }

  /**
   * Function to generate the graph
   * 
   * @param {object} data - The data corresponding to the graph
   * @param {string} value - The type of the graph to be generated
   * @returns {JSX} - The graph corresponding to the type of the graph requested by the user
   */
  function generateGraph(data, value) {
    const details = data.details;
    const mainThreadTimeData = extractMainThreadTime(details);
    const blockingTimeData = extractBlockingTime(details);
    // If user requests blocking time graph
    if (value === "blocking") {
      if (blockingTimeData.length > 0) {
        return <DoughnutChart title={"Blocking Time"} data={blockingTimeData}></DoughnutChart>
      }
      else {
        return <></>
      }
    }
    // If user requests main thread time graph
    else {
      if (mainThreadTimeData.length > 0) {
        return <DoughnutChart title={"Main Thread Time"} data={mainThreadTimeData} />
      }
      else {
        return <></>
      }
    }

  }

  // This function updates the state of the graph to be shown or not
  function passData(data) {
    setDisplayGraph(data);
  }

  // This function is fired whenever a different type of graph is requested and it sets the value of the type of graph requested in the state
  function changeHandler(e) {
    setValue(e.target.value);
  }

  return (
    <>
      {!data && (<Navigate to="/" />)}
      {data && (
        <div>
          <NavBar />
          {data.details ? (<>
            <h1 style={{ textAlign: "center" }}>Third Party Summary</h1>
            <h5 style={{ textAlign: "center" }}>Execution And Blocking Times For Various Third Party Scripts And Entities</h5>
            <div className="table-container">
              <ThirdPartyTable id={'third-party-summary'} headings={data.details.headings} items={data.details.items} passData={passData} />
            </div>
            <div className="graph-container">
              {displayGraph && (<>
                <select value={value} onChange={changeHandler} style={{ marginTop: "2em" }}>
                  <option value="mainthread">Main Thread Time</option>
                  <option value="blocking">Blocking Time</option>
                </select>
                {generateGraph(data, value)}
              </>)}
            </div>
          </>) : <h2 style={{ textAlign: "center" }}> Nothing to show here... </h2>}
        </div>
      )}
    </>
  )
}
