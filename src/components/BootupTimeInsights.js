import React from "react";
import Table from "./Table";

function BootupTimeInsights({ data }) {
  function getLongestTime() {
    let val = data.details.items.reduce((val, { total }) => {
      return Math.max(val, total);
    }, 0);
    return Math.round(val * 100) / 100;
  }

  return (
    <div style={{ marginBottom: "10em" }}>
      {data && data.details && (
        <>
          <h1 style={{ textAlign: "center" }}>Bootup Time</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <h6 style={{ textAlign: "center" }}>
            {" "}
            Consider reducing the time spent parsing, compiling, and executing
            JS. You may find delivering smaller JS payloads helps with this.{" "}
          </h6>
          <div className="table-container">
            <Table
              id={"bootup-time"}
              headings={data.details.headings}
              items={data.details.items.filter(
                ({ url }) => url !== "Unattributable"
              )}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            From bootup time we can see that we have{" "}
            <strong>{data.details.items.length}</strong> scripts with Total CPU
            Time of more than 50ms.
            <br />
            The longest time taken by any script is{" "}
            <strong>{getLongestTime()} ms</strong>.
            <br />
            To improve the website's performance we can try reducing the script
            size.
          </p>
        </>
      )}
    </div>
  );
}

export default BootupTimeInsights;
