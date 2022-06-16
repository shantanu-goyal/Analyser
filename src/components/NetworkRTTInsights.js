import React from "react";
import Table from "./Table";

function NetworkRTTInsights({ data }) {
  const longRTTOrigins = data.details.items.filter(({ rtt }) => rtt > 50);

  return (
    <div style={{ marginBottom: "10em" }} id="networkRTTInsights">
      {data && data.details && (
        <>
          <h1 style={{ textAlign: "center" }}>Network RTT</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <h6 style={{ textAlign: "center" }}>
            {" "}
            Network round trip times (RTT) have a large impact on performance.
            If the RTT to an origin is high, its an indication that servers
            closer to the user could improve performance.{" "}
          </h6>
          {longRTTOrigins.length ? (
            <>
              {" "}
              <div className="table-container">
                <Table
                  id={"network-rtt"}
                  headings={data.details.headings}
                  items={longRTTOrigins}
                />
              </div>
              <p style={{ textAlign: "center" }}>
                Requests were made to a total{" "}
                <strong>{data.details.items.length}</strong> servers. RTT for
                above shown <strong>{longRTTOrigins.length}</strong> servers are
                more than 50ms.
                <br /> RTT can be reduced by bringing the servers closer to the
                users.
              </p>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>
              Requests were made to a total{" "}
              <strong>{data.details.items.length}</strong> servers. All the
              servers have RTT less than 50ms. Well Done!
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default NetworkRTTInsights;
