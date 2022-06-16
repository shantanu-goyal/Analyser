import React from "react";
import Table from "./Table";

function MainThreadWorkInsights({ data }) {
  function getMaxTimeCategory() {
    return data.details.items.reduce((val, item) => {
      return val.duration < item.duration ? item : val;
    });
  }

  function getMinTimeCategory() {
    return data.details.items.reduce((val, item) => {
      return val.duration > item.duration ? item : val;
    });
  }

  return (
    <div style={{ marginBottom: "10em" }} id="mainThreadWorkInsights">
      {data && data.details && (
        <>
          <h1 style={{ textAlign: "center" }}>Main Thread Work Breakdown</h1>
          <h4 style={{ textAlign: "center" }}> {data.title} </h4>
          <h6 style={{ textAlign: "center" }}>
            {" "}
            Consider reducing the time spent parsing, compiling and executing
            JS. You may find delivering smaller JS payloads helps with this.{" "}
          </h6>
          <div className="table-container">
            <Table
              id={"mainthread-work-breakdown"}
              headings={data.details.headings}
              items={data.details.items}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            Maximum time (
            <strong>
              {Math.round(getMaxTimeCategory().duration * 100) / 100} ms
            </strong>
            ) is spent on <strong>{getMaxTimeCategory().groupLabel} </strong>by
            the main thread. While the main thread has to spend only{" "}
            <strong>
              {Math.round(getMinTimeCategory().duration * 100) / 100} ms
            </strong>{" "}
            in work of category{" "}
            <strong>{getMinTimeCategory().groupLabel}</strong>.<br /> To improve
            the website's performance we can try reducing the script size.
          </p>
        </>
      )}
    </div>
  );
}

export default MainThreadWorkInsights;
