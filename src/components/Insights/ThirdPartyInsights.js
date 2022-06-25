import React from "react";
import Table from "./Table";

function ServerLatencyInsights({ data }) {
  const maxSizeEntity = data.entities.filter(
    (entity) => entity[1].transferSize > 100 * 1024
  );

  const maxTimeEntity = data.entities.filter(
    (entity) => entity[1].mainThreadTime > 100
  );

  const renderBlockingEntities = data.entities.filter(
    (entity) => entity[1].blockingTime > 0
  );

  const tableContent = (() => {
    const tableEntitySet = new Set([
      ...maxSizeEntity,
      ...maxTimeEntity,
      ...renderBlockingEntities,
    ]);
    const tableEntities = [];
    tableEntitySet.forEach((entity) => {
      tableEntities.push({
        entity: entity[0],
        ...entity[1],
      });
    });
    const headings = [
      { key: "entity", text: "Third-Party", itemType: "link" },
      { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
      { key: "blockingTime", text: "Render Blocking Time", itemType: "ms" },
      { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
    ];
    return {
      headings,
      items: tableEntities,
    };
  })();
  console.log(
    "🚀 ~ file: ThirdPartyInsights.js ~ line 43 ~ tableContent ~ tableContent",
    tableContent
  );

  return (
    <div style={{ marginBottom: "10em" }} id="thirdPartyInsights">
      {data && data.entities && (
        <>
          <h1 style={{ textAlign: "center" }}>Third Party Summary</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <h6 style={{ textAlign: "center" }}>
            {" "}
            Third-party code can significantly impact load performance. Limit
            the number of redundant third-party providers and try to load
            third-party code after your page has primarily finished loading.{" "}
          </h6>
          {tableContent.items.length > 0 ? (
            <>
              <div className="table-container">
                <Table
                  id={"bootup-time"}
                  headings={tableContent.headings}
                  items={tableContent.items}
                />
              </div>
              <p style={{ textAlign: "center" }}>
                Total <strong>{data.thirdPartyScripts.length}</strong>{" "}
                third-party scripts are being used from{" "}
                <strong>{data.entities.length}</strong> third party entities.
                <br /> Among all the third party entities,{" "}
                <strong>{maxSizeEntity.length}</strong> entities have a combined
                transfer size more than 100 KB.
                <br /> Among all the third party entities,{" "}
                <strong>{maxTimeEntity.length}</strong> entities have a combined
                load time of more than 100ms. <br />
                There were <strong>{renderBlockingEntities.length}</strong>{" "}
                render blocking third party entities.
              </p>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>
              Congrats! none of the third party entities are compromising with
              the website's performance.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ServerLatencyInsights;
