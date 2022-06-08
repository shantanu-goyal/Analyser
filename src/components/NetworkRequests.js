import { useContext,useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";

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
  return <div>Graph</div>
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
      <Table id={'network-requests'} headings={data.details.headings} items={data.details.items} passData={passData} />
      {graph &&(generateGraph(data))}
    </div>
  )
}
