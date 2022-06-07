import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";


export default function NetworkServerLatency() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  console.log(data);
  data = data['network-server-latency'];
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network Server Latency</h1>
      <Table id={'network-server-latency'} headings={data.details.headings} items={data.details.items} />
    </div>
  )
}
