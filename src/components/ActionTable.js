import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import Table from "./Table";
import {
  shouldLazyload,
  isHeavy,
  isOld,
  isRenderBlocking,
} from "../utility/actionTableUtils";

function ActionTable({ data }) {
  const dataContext = useContext(DataContext);
  const renderBlockingResources =
    dataContext.data.data["render-blocking-resources"];
  const loadTime = dataContext.data.data["load"].numericValue;

  const tableData = data.map((entity) => {
    const obj = {
      entity: entity.entityName.name,
      lazyload: shouldLazyload(entity, loadTime),
      heavy: isHeavy(entity),
      old: isOld(entity),
    };
    if (renderBlockingResources) obj.renderBlocking = isRenderBlocking(entity);
    return obj;
  });

  const headings = [
    { key: "entity", text: "Entity", itemType: "binary" },
    { key: "lazyload", text: "Lazyload", itemType: "binary" },
    { key: "heavy", text: "Shift to web workers", itemType: "binary" },
    { key: "old", text: "Check for latest version", itemType: "binary" },
  ];

  return (
    <div style={{ marginBottom: "10em" }}>
      <h1
        style={{
          textAlign: "center",
          margin: "1em",
          color: "var(--color-text)",
        }}
      >
        Possible Optimisations{" "}
      </h1>
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
          hideInput={true}
          showPagination={false}
        />
        <div className="action-table-subheading">
          <h6>
            If web worker is checked in any case, then try to shift the scripts
            to a web worker
          </h6>
          <h6>
            Always use async if it's important to have the script run earlier in
            the loading process.
          </h6>
          <h6>Use defer for less critical resources.</h6>
          <h6>
            If resources are not critical and if you want to control the time or
            the conditions at which the script loads, try lazy loading the
            script
          </h6>
          <h6>
            Finally check if your script matches with the latest available
            version
          </h6>
        </div>
      </div>
    </div>
  );
}

export default ActionTable;
