import React from "react";
import Table from "./Table";

function BootupTimeInsights({ data }) {
  const poorlyCompressedResources = data.details.items.filter(
    ({ resourceSize, transferSize }) =>
      transferSize > 0 && resourceSize / transferSize < 5
  );

  return (
    <div style={{ marginBottom: "10em" }}>
      {data && data.details && (
        <>
          <h1 style={{ textAlign: "center" }}>Network Requests</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <h6 style={{ textAlign: "center" }}> {data.description} </h6>
          {poorlyCompressedResources.length ? (
            <>
              <div className="table-container">
                <Table
                  id={"bootup-time"}
                  headings={data.details.headings}
                  items={poorlyCompressedResources}
                />
              </div>
              <p style={{ textAlign: "center" }}>
                The website makes <strong>{data.details.items.length}</strong>{" "}
                network requests during the analysis out of which above given{" "}
                <strong>{poorlyCompressedResources.length}</strong> resources
                are poorly compressed as their Tansfer size is greater than one
                fifth of Resource Size.
                <br /> The number of requests can be reduced by bundling the
                scripts.
              </p>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>
              The website makes <strong>{data.details.items.length}</strong>{" "}
              network requests during the analysis. All resources were nicely
              compressed. Well Done!
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default BootupTimeInsights;
