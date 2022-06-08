import { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";


function extractTotalTime(data) {
  let totalTimeData = data.items.map(item => {
    return {
      url: item.url,
      data: item.total
    }
  })
  return totalTimeData;
}

function extractScriptEvaluationTime(data) {
  let scriptEvaluationTimeData = data.items.map(item => {
    return {
      url: item.url,
      data: item.scripting
    }
  })
  return scriptEvaluationTimeData;
}


function extractScriptParsingTime(data) {
  let scriptParsingTimeData = data.items.map(item => {
    return {
      url: item.url,
      data: item.scriptParseCompile
    }
  })
  return scriptParsingTimeData;
}





function generateGraph(data){
  const details = data.details;
  const total=extractTotalTime(details);
  const evaluation=extractScriptEvaluationTime(details);
  const parsing=extractScriptParsingTime(details);
  return <div>Graph</div>
}



export default function BootupTime() {
  const [graph,setGraph]=useState();
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['bootup-time'];
  
  const passData=(data)=>{
    setGraph(data);
  }
  
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Bootup Time</h1>
      <Table id={'bootup-time'} headings={data.details.headings} items={data.details.items} passData={passData} />

      
      {graph &&(generateGraph(data))}
    </div>
  )
}
