import { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";

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
  return <div>Graph</div>
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
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network Server Latency</h1>
      <Table id={'network-server-latency'} headings={data.details.headings} items={data.details.items} passData={passData} />
      {graph &&(generateGraph(data))}
    </div>
  )
}
