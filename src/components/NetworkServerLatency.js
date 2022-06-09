import { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import DoughnutChart from "./Graphs/DoughnutChart";
import { NavBar } from "./NavBar";
import Table from "./Table";
import "../styles/Graph.css"
import { Navigate } from "react-router";

function extractNetworkServerLatencyTime(data) {
  let totalTimeData = data.items.map(item => {
    return {
      url: item.origin,
      data: item.serverResponseTime
    }
  })
  return totalTimeData;
}



function generateGraph(data){
  const details = data.details;
  const latencyTime=extractNetworkServerLatencyTime(details);
  return (<DoughnutChart data={latencyTime} title={"Network Server Latency"} />)
}



export default function NetworkServerLatency() {
  const [graph, setGraph]=useState();
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['network-server-latency'];
  
  const passData=(data)=>{
    setGraph(data);
  }
  
  return (
    <>
    {!data && (<Navigate to="/" />)}
    {data && (
      <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network Server Latency</h1>
      <h5 style={{ textAlign: "center" }}>Server Backend Latencies</h5>
      <div className="table-container">
        <Table id={'network-server-latency'} headings={data.details.headings} items={data.details.items} passData={passData} />
      </div>
      <div className="graph-container">
          {graph &&(generateGraph(data))}
      </div>
    </div>
    )}
    </>  
  )
}
