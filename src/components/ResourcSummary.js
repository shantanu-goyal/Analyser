import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";

export default function ResourceSummary() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['resource-summary'];
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Resource Summary</h1>
      <Table id={'resource-summary'} headings={data.details.headings} items={data.details.items} />
    </div>
  )
}
