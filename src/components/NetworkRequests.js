import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";

export default function NetworkRequests() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  console.log(data);
  data = data['network-requests'];
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Network Requests</h1>
      <Table id={'network-requests'} headings={data.details.headings} items={data.details.items} />
    </div>
  )
}
