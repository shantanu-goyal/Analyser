import { useContext,useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";
import DoughnutChart from "./Graphs/DoughnutChart";
import "../styles/Graph.css"


function extractDurationTime(data) {
  let durationTimeData = data.items.map(item => {
    if(item.finished){
      return {
        url: item.url,
        data: item.endTime-item.startTime
      }
    }
  }).filter(value => Object.keys(value).length !== 0);
  return durationTimeData;
}


function generateGraph(data){
  const details = data.details;
  const durationTimeData=extractDurationTime(details);
  return <DoughnutChart data={durationTimeData} title={"Durartion of Network Requests"} />
}



export default function NetworkRequests() {
  const dataContext = useContext(DataContext);
  const [graph,setGraph]=useState();
  let data = dataContext.data.data;
  data = data['network-requests'];

  const passData=(data)=>{
    setGraph(data);
  }

  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network Requests</h1>
      <div className="table-container">
        <Table id={'network-requests'} headings={data.details.headings} items={data.details.items} passData={passData} />
        <div className="graph-container">
          {graph &&(generateGraph(data))}
        </div>
      </div>
    </div>
  )
}
