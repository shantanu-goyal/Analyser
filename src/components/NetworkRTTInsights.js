import React from "react";
import Table from "./Table";

function NetworkRTTInsights({ data }) {
  function getLongRTTOrigins() {
    return data.details.items.filter(({ rtt }) => rtt > 50);
  }

  return (
    <div style={{ marginBottom: "10em" }}>
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
          <div className="table-container">
            <Table
              id={"bootup-time"}
              headings={data.details.headings}
              items={getLongRTTOrigins()}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            Requests were made to a total{" "}
            <strong>{data.details.items.length}</strong> servers. RTT for above
            shown <strong>{getLongRTTOrigins().length}</strong> servers are more
            than 50ms.
            <br /> RTT can be reduced by bringing the servers closer to the
            users.
          </p>
        </>
      )}
    </div>
  );
}

export default NetworkRTTInsights;
