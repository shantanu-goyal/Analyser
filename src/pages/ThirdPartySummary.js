import { thirdPartyWeb } from '../utility/third-party-web/entity-finder-api'
import React, { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "../components/NavBar";
import ThirdPartyTable from '../components/ThirdPartyTable'
import DoughnutChart from '../components/Graphs/DoughnutChart';
import { Navigate } from 'react-router-dom';

export default function ThirdPartySummary() {

  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data["third-party-summary"];
  // State to store whether the graph should be shown or not.
  const [displayGraph, setDisplayGraph] = useState();
  // State to store the type of the graph to be generated. Defaults to the main thread time graph.
  const [value, setValue] = useState("mainthread");

  function getScripts(items) {
    return items.filter((item) => item.url.includes(".js") && !item.url.includes(".json"));
  }

  function transformData(data) {
    let items = data.details;
    items = items.map(item => {
      return {
        url: item[0],
        data: item[1]
      }
    })
    const scripts = getScripts(items);
    const byEntity = new Map();
    const thirdPartyScripts = [];
    scripts.forEach(script => {
      let scriptURL = (script.url);
      let entity = thirdPartyWeb.getEntity(scriptURL);
      let scriptData = script.data;
      const defaultConfig = {
        mainThreadTime: 0,
        blockingTime: 0,
        transferSize: 0
      }
      if (entity) {
        thirdPartyScripts.push(script);
        const currentEntity = byEntity.get(entity) || { ...defaultConfig };
        currentEntity.mainThreadTime += scriptData.mainThreadTime;
        currentEntity.blockingTime += scriptData.blockingTime;
        currentEntity.transferSize += scriptData.transferSize;
        byEntity.set(entity, currentEntity);
      }
    })
    const entities = Array.from(byEntity.entries());
    return { entities, thirdPartyScripts };
  }

  function getMainThreadTime(scripts) {
    const result = scripts.map(script => {
      return {
        url: script.url,
        data: script.data.mainThreadTime
      }
    }).filter(script => script.data > 0);
    return result;
  }


  function getRenderBlockingTime(scripts) {
    const result = scripts.map(script => {
      return {
        url: script.url,
        data: script.data.blockingTime
      }
    }).filter(script => script.data > 0);
    return result;
  }

  /**
   * Function to generate the graph
   *
   * @param {object} data - The data corresponding to the graph
   * @param {string} value - The type of the graph to be generated
   * @returns {JSX} - The graph corresponding to the type of the graph requested by the user
   */
  function generateGraph(scripts, value) {
    const mainThreadTimeData = getMainThreadTime(scripts);
    const blockingTimeData = getRenderBlockingTime(scripts);
    // If user requests blocking time graph
    if (value === "blocking") {
      if (blockingTimeData.length > 0) {
        return (
          <DoughnutChart
            title={"Render Blocking Time"}
            data={blockingTimeData}
          ></DoughnutChart>
        );
      } else {
        return <></>;
      }
    }
    // If user requests main thread time graph
    else {
      if (mainThreadTimeData.length > 0) {
        return (
          <DoughnutChart title={"Main Thread Time"} data={mainThreadTimeData} />
        );
      } else {
        return <></>;
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

  const { entities, thirdPartyScripts } = transformData(data);

  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <div>
          <NavBar />
          {data.details ? (
            <>
              <h1 style={{ textAlign: "center" }}>Third Party Summary</h1>
              <h4 style={{ textAlign: "center" }}> {data.title} </h4>
              <h6 style={{ textAlign: "center" }}>
                {" "}
                Third-party code can significantly impact load performance.
                Limit the number of redundant third-party providers and try to
                load third-party code after your page has primarily finished
                loading.{" "}
              </h6>
              <div className="table-container">
                <ThirdPartyTable
                  id={"third-party-summary"}
                  scripts={thirdPartyScripts}
                  entities={entities}
                  passData={passData}
                />
              </div>
              <div className="graph-container">
                {displayGraph && (
                  <>
                    <select
                      value={value}
                      onChange={changeHandler}
                      style={{ marginTop: "2em" }}
                    >
                      <option value="mainthread">Main Thread Time</option>
                      <option value="blocking">Render Blocking Time</option>
                    </select>
                    {generateGraph(thirdPartyScripts, value)}
                  </>
                )}
              </div>
            </>
          ) : (
            <h2 style={{ textAlign: "center" }}> Nothing to show here... </h2>
          )}
        </div>
      )}
    </>
  );
}
