import { useContext,useState } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";


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
  return <div>Graph</div>
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
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network RTT</h1>
      <Table id={'network-rtt'} headings={data.details.headings} items={data.details.items} passData={passData} />
      {graph &&(generateGraph(data))}

    </div>
  )
}
