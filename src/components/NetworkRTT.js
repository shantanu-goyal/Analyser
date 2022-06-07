import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";


export default function NetworkRTT() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  console.log(data);
  data = data['network-rtt'];
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network RTT</h1>
      <Table id={'network-rtt'} headings={data.details.headings} items={data.details.items} />
    </div>
  )
}
