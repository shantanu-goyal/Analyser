import { useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import ThirdPartyTable from "./ThirdPartyTable";
import DoughnutChart from "./Graphs/DoughnutChart";
import "../styles/Graph.css"
import { Navigate } from "react-router";

function extractMainThreadTime(data) {
  let mainThreadTimeData = data.items.map(item => {
    const subItemData = item.subItems.items.map(subitem => {
      return {
        url: subitem.url,
        data: (subitem.mainThreadTime === undefined) ? 0 : subitem.mainThreadTime
      }
    })
    return subItemData;
  }).filter(element => {
    if (Object.keys(element).length !== 0) {
      return true;
    }
    return false;
  });
  mainThreadTimeData = [...mainThreadTimeData];
  let finalAns = []
  for (let i = 0; i < mainThreadTimeData.length; i++) {
    finalAns.push(...mainThreadTimeData[i]);
  }
  return finalAns.filter(element => {
    if (element.data > 0) {
      return true;
    }
    return false;
  });
}

function extractBlockingTime(data) {
  let blockingTimeData = data.items.map(item => {
    const subItemData = item.subItems.items.map(subitem => {
      return {
        url: subitem.url,
        data: (subitem.blockingTime === undefined) ? 0 : subitem.blockingTime
      }
    })
    return subItemData;
  }).filter(element => {
    if (Object.keys(element).length !== 0) {
      return true;
    }
    return false;
  });
  blockingTimeData = [...blockingTimeData];
  let finalAns = []
  for (let i = 0; i < blockingTimeData.length; i++) {
    finalAns.push(...blockingTimeData[i]);
  }
  return finalAns.filter(element => {
    if (element.data > 0) {
      return true;
    }
    return false;
  });
}


function generateGraph(data,value){
  const details = data.details;
  const mainThreadTimeData = extractMainThreadTime(details);
  const blockingTimeData = extractBlockingTime(details);
  if(value==="blocking"){
    return <DoughnutChart title={"Blocking Time"} data={blockingTimeData}></DoughnutChart>
  }

  return <DoughnutChart title={"Main Thread Time"} data={mainThreadTimeData} />
}


export default function ThirdPartySummary() {
  const [graph,setGraph]=useState();
  const [value,setValue]=useState("mainthread");
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['third-party-summary'];

  const passData=(data)=>{
    setGraph(data);
  }

  function changeHandler(e){
    console.log(e.target.value);
    setValue(e.target.value);
  }

  return (
    <>
      {!data && (<Navigate to="/" />)}
      {data && (
        <div>
        <NavBar />
        {data.details && (<>
          <h1 style={{ textAlign: "center" }}>Third Party Summary</h1>
          <div className="table-container">
          <ThirdPartyTable id={'third-party-summary'} headings={data.details.headings} items={data.details.items} passData={passData}/>
            <div className="graph-container">
                {graph &&(<>
                  <select value={value} onChange={changeHandler} style={{marginTop:"2em"}}>
                    <option value="mainthread">Main Thread Time</option>
                    <option value="blocking">Blocking Time</option>
                  </select>
                  {generateGraph(data,value)}
                </>)}
              </div>
          </div>
        </>)}
      </div>
      )}
   </>
  )
}
