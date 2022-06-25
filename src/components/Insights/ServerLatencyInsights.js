import React from "react";
import Table from "./Table";

function ServerLatencyInsights({ data }) {
  const longLatencyOrigins = data.details.items.filter(
    ({ serverResponseTime }) => serverResponseTime > 100
  );

  return (
    <div style={{ marginBottom: "10em" }} id="serverLatencyInsights">
      {data && data.details && (
        <>
          <h1 style={{ textAlign: "center" }}>Network Server Latency</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <h6 style={{ textAlign: "center" }}>
            {" "}
            Server latencies can impact web performance. If the server latency
            of an origin is high, its an indication the server is overloaded or
            has poor backend performance.{" "}
          </h6>
          {longLatencyOrigins.length > 0 ? (
            <>
              <div className="table-container">
                <Table
                  id={"bootup-time"}
                  headings={data.details.headings}
                  items={longLatencyOrigins}
                />
              </div>
              <p style={{ textAlign: "center" }}>
                Out of the <strong>{data.details.items.length}</strong> servers,
                backend latency for above shown{" "}
                <strong>{longLatencyOrigins.length}</strong> servers are more
                than 100ms.
                <br /> The latency of these servers can be reduced by scaling up
                the servers and managing server resources more efficiently.
              </p>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>
              Out of the <strong>{data.details.items.length}</strong> servers,
              backend latency for none of the servers are more than 100ms.
              Congrats!
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ServerLatencyInsights;
