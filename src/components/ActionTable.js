import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import Table from "./Table";

function ActionTable({ data }) {
  const dataContext = useContext(DataContext);
  const renderBlockingResources =
    dataContext.data.data["render-blocking-resources"];
  const fcp = dataContext.data.data["first-contentful-paint"].numericValue;

  const tableData = data.map((entity) => {
    const obj = {
      entity: entity.entityName.name,
      unused:
        entity.subItems.items.some(
          ({ unusedPercentage }) => unusedPercentage === 100
        ) ||
        (entity.intervals.length > 0 &&
          entity.intervals[0].startTime <= fcp + 500),
      heavy:
        entity.subItems.items.length > 0 &&
        (entity.subItems.items.at(-1).blockingTime > 0 ||
          entity.subItems.items.at(-1).mainThreadTime > 250 ||
          entity.subItems.items.at(-1).mainThreadTime /
            entity.subItems.items.length >
            50),
      old:
        entity.subItems.items.length > 0 &&
        (entity.subItems.items.at(-1).resourceSize /
          entity.subItems.items.at(-1).transferSize <=
          2 ||
          entity.subItems.items.at(-1).minified === "No" ||
          entity.subItems.items.at(-1).unusedPercentage >= 50 ||
          entity.subItems.items.at(-1).blockingTime > 250 ||
          entity.subItems.items.at(-1).blockingTime /
            entity.subItems.items.length >
            50),
    };
    if (renderBlockingResources)
      obj.renderBlocking =
        entity.subItems.items.length > 0 &&
        entity.subItems.items.at(-1).renderBlocking > 0;
    return obj;
  });

  const headings = [
    { key: "entity", text: "Entity", itemType: "binary" },
    { key: "unused", text: "Lazyload", itemType: "binary" },
    { key: "heavy", text: "Shift to web workers", itemType: "binary" },
    { key: "old", text: "Check for latest version", itemType: "binary" },
  ];

  return (
    <div style={{ marginBottom: "10em" }}>
      <h1 style={{ textAlign: "center", margin: "1em", color:"var(--color-text)" }}>Possible Optimisations </h1>
      <div className="table-container">
        <Table
          headings={
            renderBlockingResources
              ? [
                  ...headings,
                  {
                    key: "renderBlocking",
                    text: "Use async/defer",
                    itemType: "binary",
                  },
                ]
              : headings
          }
          items={tableData}
          id={"actiontable"}
          notShowInput={true}
          showPagination={false}
        />
       <div className="action-table-subheading">
       <h6>
          If web worker is checked in any case, then try to shift the scripts to
          a web worker
        </h6>
        <h6>
          Always use async if it's important to have the script run earlier in
          the loading process.
        </h6>
        <h6>Use defer for less critical resources.</h6>
        <h6>
          If resources are not critical and if you want to control the time or
          the conditions at which the script loads, try lazy loading the script
        </h6>
        <h6>
          Finally check if your script matches with the latest available version
        </h6>
       </div>
      </div>
    </div>
  );
}

export default ActionTable;
