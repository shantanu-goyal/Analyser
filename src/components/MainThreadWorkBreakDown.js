import { useContext,useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";
import '../styles/Graph.css'
import DoughnutChart from "./Graphs/DoughnutChart";
import { Navigate } from "react-router";


function extractTotalTime(data) {
  let totalTimeData = data.items.map(item => {
    return {
      url: item.groupLabel,
      data: item.duration
    }
  })
  return totalTimeData;
}



function generateGraph(data){
  const details = data.details;
  const durationData=extractTotalTime(details);
  return <DoughnutChart data={durationData} title={"Main Thread Work Breakdown"}/>
}


export default function MainThreadWorkBreakdown() {
  const dataContext = useContext(DataContext);
  const [graph,setGraph]=useState();
  let data = dataContext.data.data;
  data = data['mainthread-work-breakdown'];

  const passData=(data)=>{
    setGraph(data);
  }

  return (
    <>
     {!data && (
      <Navigate to="/"></Navigate>
    )}
    {data && (<div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Main Thread Work Breakdown</h1>
      <div className="table-container">
        <Table id={'mainthread-work-breakdown'} headings={data.details.headings} items={data.details.items} passData={passData} />
        <div className="graph-container">
          {graph &&(generateGraph(data))}
        </div>
      </div>      
    </div>)}
    </>
  )
}
