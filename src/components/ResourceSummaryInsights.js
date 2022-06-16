import React from "react";
import Table from "./Table";

function ServerLatencyInsights({ data }) {
  function getMaxRequestedResourceType() {
    return data.details.items.reduce((val, item) => {
      return val.requestCount > item.requestCount &&
        val.resourceType !== "total"
        ? val
        : item;
    });
  }

  return (
    <div style={{ marginBottom: "10em" }} id="resourceSummaryInsights">
      {data && data.details && (
        <>
          <h1 style={{ textAlign: "center" }}>Resource Summary</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <div className="table-container">
            <Table
              id={"bootup-time"}
              headings={data.details.headings}
              items={data.details.items}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            Total <strong>{data.details.items[0].requestCount}</strong> resource
            requests were made during the analysis time.
            <br /> Maximum requests (
            <strong>{getMaxRequestedResourceType().requestCount}</strong>) were
            made for resources of type{" "}
            <strong>{getMaxRequestedResourceType().resourceType}</strong>.
            <br /> Number of requests can be reduced by properly bundling the
            resources.
          </p>
        </>
      )}
    </div>
  );
}

export default ServerLatencyInsights;
