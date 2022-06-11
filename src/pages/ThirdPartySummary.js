import { useContext, useState } from "react";
import { Navigate } from "react-router";

// Importing the context
import { DataContext } from "../contexts/DataContext";
// Importing the components
import { NavBar } from "../components/NavBar";
import ThirdPartyTable from "../components/ThirdPartyTable";
import DoughnutChart from "../components/Graphs/DoughnutChart";

// Importing the styles
import "../styles/Graph.css"


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

  if (value === "blocking") {
    return <DoughnutChart title={"Blocking Time"} data={blockingTimeData}></DoughnutChart>
  }
  else {
    return <DoughnutChart title={"Main Thread Time"} data={mainThreadTimeData} />
  }

}


export default function ThirdPartySummary() {
  const [graph, setGraph] = useState();
  const [value, setValue] = useState("mainthread");
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['third-party-summary'];

  const passData = (data) => {
    setGraph(data);
  }

  function changeHandler(e) {
    console.log(e.target.value);
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
              {graph && (<>
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
