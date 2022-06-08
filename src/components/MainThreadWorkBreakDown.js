import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import Table from "./Table";

export default function MainThreadWorkBreakdown() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  data = data['mainthread-work-breakdown'];
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Main Thread Work Breakdown</h1>
      <Table id={'mainthread-work-breakdown'} headings={data.details.headings} items={data.details.items} />
    </div>
  )
}
