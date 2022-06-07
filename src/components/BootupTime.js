import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";


export default function BootupTime() {

  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  console.log(data);
  data = data['bootup-time'];
  console.log(data);
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Bootup Time</h1>
      <Table id={'bootup-time'} headings={data.details.headings} items={data.details.items} />
    </div>
  )
}
