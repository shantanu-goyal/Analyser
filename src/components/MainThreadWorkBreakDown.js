import { useContext,useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";


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
  return <div>Graph</div>
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
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Main Thread Work Breakdown</h1>
      <Table id={'mainthread-work-breakdown'} headings={data.details.headings} items={data.details.items} passData={passData} />
      {graph &&(generateGraph(data))}
    </div>
  )
}
