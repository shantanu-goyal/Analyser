import { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";
import DoughnutChart from './Graphs/DoughnutChart'
import "../styles/Graph.css"
import { Navigate } from "react-router";

function extractTransferSize(data) {
  let transferSizeData = data.items.map(item => {
    return {
      url: item.label,
      data: item.transferSize
    }
  })
  return transferSizeData;
}


function generateGraph(data){
  const details = data.details;
  const transferSizeData=extractTransferSize(details);
  return (<DoughnutChart data={transferSizeData} title={"Resource Summary"} />)
}


export default function ResourceSummary() {
  const [graph,setGraph]=useState();
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['resource-summary'];
  const passData=(data)=>{
    setGraph(data);
  }


  return (
    <>
    {!data && (<Navigate to="/" />)}
    {data && (<div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Resource Summary</h1>
      <h5 style={{ textAlign: "center" }}>Request Counts And Transfer Size of Various Types of Resources</h5>
      <div className="table-container">
        <Table id={'resource-summary'} headings={data.details.headings} items={data.details.items} passData={passData}/>
      </div>
      <div className="graph-container">
        {graph &&(generateGraph(data))}
        </div>
    </div>)}
    </>
    
  )
}
