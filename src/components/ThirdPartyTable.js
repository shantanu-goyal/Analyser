import { useState } from "react";
import Table from "./Table";
import '../styles/ThirdPartyTable.css'

function ThirdPartyTable({ id, headings, items, passData }) {
  const [view, setView] = useState("entity");
  const [thirdPartyHeadings, setThirdPartyHeadings] = useState([...headings]);
  const [thirdPartyItems, setThirdPartyItems] = useState([...items]);

  function changeView(e) {
    if (e.target.value === "script") {
      setView("script");
      setThirdPartyHeadings([
        { key: "url", text: "URL", itemType: "text" },
        { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
        { key: "blockingTime", text: "Blocking Time", itemType: "ms" },
        { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
      ]);
      setThirdPartyItems(
        items.reduce((arr, item) => {
          if (item.subItems && item.subItems.items) {
            return arr.concat(
              item.subItems.items.filter(
                (item) => item.url !== "Other resources"
              )
            );
          }
          return arr;
        }, [])
      );
    } else {
      setView("entity");
      setThirdPartyHeadings([...headings]);
      setThirdPartyItems([...items]);
    }
  }

  return (
    <div className="third-party-wrapper" style={{marginLeft:"1em"}}>
      <select style={{marginLeft:"1em"}} id="select-box" value={view} onChange={changeView}>
        <option value="entity">Entity View</option>
        <option value="script">Script View</option>
      </select>
      <div className="table-container">
        <Table id={id} headings={thirdPartyHeadings} items={thirdPartyItems} passData={passData} />
      </div>
    </div>
  );
}

export default ThirdPartyTable;
