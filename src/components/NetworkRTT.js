import React, { useContext,useState } from "react";
import { DataContext } from "../contexts/DataContext";
import DoughnutChart from "./Graphs/DoughnutChart";
import { NavBar } from "./NavBar";
import Table from "./Table";
import "../styles/Graph.css"
import { Navigate } from "react-router";

function extractRTTTime(data) {
  let RTTData = data.items.map(item => {
    return {
      url: item.origin,
      data: item.rtt
    }
  })
  return RTTData;
}


function generateGraph(data){
  const details = data.details;
  const timeData=extractRTTTime(details);
  return <DoughnutChart data={timeData} title={"Network RTT"}></DoughnutChart>
}


export default function NetworkRTT() {
  const [graph,setGraph]=useState();
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['network-rtt'];

  const passData=(data)=>{
    setGraph(data);
  }

  return (
    <>
    {!data && (<Navigate to="/" />)}
    {data && (
      <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network RTT</h1>
      <h5 style={{ textAlign: "center" }}>Network Round Trip Times</h5>
      <div className="table-container">
        <Table id={'network-rtt'} headings={data.details.headings} items={data.details.items} passData={passData} />
      </div>
      <div className="graph-container">
            {graph &&(generateGraph(data))}
        </div>
    </div>
    )}
    </>
    
  )
}
