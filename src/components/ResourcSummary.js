import { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";
import DoughnutChart from './Graphs/DoughnutChart'
import "../styles/Graph.css"

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
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Resource Summary</h1>
      <div className="table-container">
        <Table id={'resource-summary'} headings={data.details.  headings} items={data.details.items} passData={passData}/>
        <div className="graph-container">
        {graph &&(generateGraph(data))}
        </div>
      </div>
    </div>
  )
}
