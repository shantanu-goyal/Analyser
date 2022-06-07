import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { NavBar } from "./NavBar";
import ThirdPartyTable from "./ThirdPartyTable";

export default function ThirdPartySummary() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  console.log(data);
  data = data['third-party-summary'];
  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Third Party Summary</h1>
      <ThirdPartyTable id={'third-party-summary'} headings={data.details.headings} items={data.details.items} />
    </div>
  )
}
