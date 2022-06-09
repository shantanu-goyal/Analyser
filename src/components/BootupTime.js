import { useContext, useState } from "react";
import {Navigate} from 'react-router-dom'
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";
import "../styles/Graph.css"
import DoughnutChart from "./Graphs/DoughnutChart";

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





function generateGraph(data,value){
  const details = data.details;
  const total=extractTotalTime(details);
  const evaluation=extractScriptEvaluationTime(details);
  const parsing=extractScriptParsingTime(details);
  if(value==="total"){
    return <DoughnutChart title={"Total CPU Time"} data={total}></DoughnutChart>
  }
  else if(value==="script-parsing"){
    return <DoughnutChart title={"Script Parsing Time"} data={parsing}></DoughnutChart>
  }
  return <DoughnutChart title={"Script Evaluation Time"} data={evaluation} />
}



export default function BootupTime() {
  const [graph,setGraph]=useState();
  const [value,setValue]=useState("total");
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['bootup-time'];
  
  function changeHandler(e){
    setValue(e.target.value);
  }
  const passData=(data)=>{
    setGraph(data);
  }
  return (
    <>
    {!data && (
      <Navigate to="/"></Navigate>
    )}
    {data && (
          <div>
          <NavBar />
          <h1 style={{ textAlign: "center" }}>Bootup Time</h1>
    
          <div className="table-container">
            <Table id={'bootup-time'} headings={data.details.headings} items={data.details.items} passData={passData} />
          </div>
          <div className="graph-container">
              {graph &&(
                <>
                 <select value={value} onChange={changeHandler} style= {{marginTop:"2em"}}>
                    <option value="total">Total CPU Time</option>
                    <option value="script-evaluation">Script Evaluation Time</option>
                    <option value="script-parsing">Script Parsing Time</option>
                  </select>
                  {generateGraph(data,value)}
                </>
                )}
            </div>
        </div>
    )}
    </>
  )
}
