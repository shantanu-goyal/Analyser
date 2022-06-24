import React, { useContext, useRef } from "react";
import { Navigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { DataContext } from "../contexts/DataContext";
import Table from "../components/Table";
import { getOpportunities } from "../utility/insightsUtility";
import ActionTable from "../components/ActionTable";
import "../styles/Insights.css";
import html2pdf from "html2pdf.js/src";
import Button from "../components/Button";

export default function Insights() {
  const dataContext = useContext(DataContext);
  const insightsRef = useRef(null);

  let data = dataContext.data.data;
  const unminifiedJSData = data["unminified-javascript"];
  const unusedJSData = data["unused-javascript"];
  const renderBlockingResources = data["render-blocking-resources"];
  const thirdPartyData = dataContext.data.insights || [];
  const config = dataContext.data.config;
  const fcp = data["first-contentful-paint"].numericValue;

  function getSummary(item) {
    const summary = {
      url: "Summary",
      mainThreadTime: 0,
      blockingTime: 0,
      transferSize: 0,
      resourceSize: 0,
      minified: "Yes",
      unusedPercentage: 100,
    };
    item.subItems.items.forEach((subitem) => {
      summary.mainThreadTime += subitem.mainThreadTime;
      summary.blockingTime += subitem.blockingTime;
      summary.resourceSize += subitem.resourceSize;
      summary.minified = summary.minified === "No" ? "No" : subitem.minified;
      summary.unusedPercentage =
        (summary.unusedPercentage * summary.transferSize +
          subitem.unusedPercentage * subitem.transferSize) /
        (summary.transferSize + subitem.transferSize);
      summary.transferSize += subitem.transferSize;
      if (subitem.renderBlocking !== undefined)
        summary.renderBlocking = summary.renderBlocking
          ? summary.renderBlocking + subitem.renderBlocking
          : subitem.renderBlocking;
    });
    summary.startTime = item.intervals.length
      ? item.intervals[0].startTime
      : "-";
    if (summary.mainThreadTime === 0) summary.unusedPercentage = 100;
    return summary;
  }

  let thirdPartyWithNetwork = [];
  if (thirdPartyData.length > 0) {
    thirdPartyWithNetwork = thirdPartyData
      .reduce((acc, item) => {
        if (!item.entityName) return acc;
        let prevItem = acc.find(
          ({ entityName }) => item.entityName === entityName
        );
        let newItems = [];
        item.subItems.items.forEach((subitem) => {
          if (typeof subitem.url !== "string") return;

          if (
            unminifiedJSData.details.items.find(
              ({ url }) => url === subitem.url
            )
          ) {
            subitem.minified = "No";
          } else subitem.minified = "Yes";

          if (renderBlockingResources) {
            let renderBlockingResource =
              renderBlockingResources.details.items.find(
                ({ url }) => url === subitem.url
              );
            if (renderBlockingResource) {
              subitem.renderBlocking = renderBlockingResource.wastedMs;
            } else subitem.renderBlocking = 0;
          }

          let js = unusedJSData.details.items.find(
            ({ url }) => url === subitem.url
          );
          if (js) {
            subitem.unusedPercentage = js.wastedPercent;
          } else {
            if (subitem.mainThreadTime) subitem.unusedPercentage = 0;
            else subitem.unusedPercentage = 100;
          }
          subitem.startTime = subitem.intervals.length
            ? subitem.intervals[0].startTime
            : "-";
          newItems.push(subitem);
        });

        if (prevItem) {
          if (prevItem.subItems.items.length > 1) prevItem.subItems.items.pop();
          newItems = [...prevItem.subItems.items, ...newItems];
          let summary = getSummary(newItems);
          let opportunities = getOpportunities(summary, newItems.length, fcp);
          if (newItems.length > 1) newItems.push(summary);
          prevItem.opportunities = opportunities;
          prevItem.subItems.items = newItems;
          return acc;
        }
        item.subItems.items = newItems;
        let summary = getSummary(item);
        let opportunities = getOpportunities(
          summary,
          item.subItems.items.length,
          fcp
        );

        return [
          ...acc,
          {
            ...item,
            subItems: {
              ...item.subItems,
              items:
                item.subItems.items.length > 1
                  ? [...item.subItems.items, summary]
                  : [...item.subItems.items],
            },
            opportunities,
          },
        ];
      }, [])
      .sort(
        (a, b) =>
          b.opportunities.user.length +
          b.opportunities.thirdParty.length -
          (a.opportunities.user.length + a.opportunities.thirdParty.length) ||
          b.opportunities.user.length - a.opportunities.user.length
      );
  }

  const headings = [
    { key: "url", text: "URL", itemType: "link" },
    { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
    { key: "blockingTime", text: "Main Thread Blocking Time", itemType: "ms" },
    { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
    { key: "resourceSize", text: "Resource Size", itemType: "bytes" },
    { key: "minified", text: "Script Minified", itemType: "binary" },
    {
      key: "unusedPercentage",
      text: "Unused Percentage",
      itemType: "percentage",
    },
    {
      key: "startTime",
      text: "First Start Time",
      itemType: "ms",
    },
  ];

  async function downloadReport() {
    let divsToHide = document.getElementsByClassName("toolbar"); //divsToHide is an array
    let tableToHide = document.getElementsByClassName('to-hide');
    divsToHide = [...divsToHide, ...tableToHide];
    let maxHeight = 0;
    let headers = insightsRef.current.querySelectorAll("h1");
    for (let i = 0; i < headers.length; i++) {
      headers[i].style.wordSpacing = "0.5em";
      headers[i].style.letterSpacing = "0.1em";
    }
    thirdPartyWithNetwork.forEach((item) => {
      maxHeight = Math.max(
        maxHeight,
        document.getElementById(item.entityName.name).clientHeight
      );
    });
    insightsRef.current.querySelector("a").style.letterSpacing = "0.1rem";
    maxHeight = Math.min(1920, maxHeight);
    let displays = [];
    for (let i = 0; i < divsToHide.length; i++) {
      maxHeight = Math.max(maxHeight);
      displays.push(divsToHide[i].style.display);
      divsToHide[i].style.display = "none";
    }
    try {
      const opt = {
        filename: "report.pdf",
        pagebreak: { mode: "avoid-all" },
        enableLinks: true,
        jsPDF: {
          orientation: "landscape",
          unit: "in",
          format: [12, maxHeight / 90],
        },
      };
      await html2pdf().set(opt).from(insightsRef.current).save();
    } catch (err) {
      console.log(err);
    }
    for (let i = 0; i < divsToHide.length; i++) {
      divsToHide[i].style.display = displays[i];
    }
    insightsRef.current.querySelector("a").style.letterSpacing = "normal";
    for (let i = 0; i < headers.length; i++) {
      headers[i].style.wordSpacing = "normal";
      headers[i].style.letterSpacing = "normal";
    }
  }

  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <>
          <NavBar />
          <div className="insights-wrapper">
            <Button onClick={downloadReport}>
              Download PDF
            </Button>
            <div className="insights-wrapper" ref={insightsRef}>
              <a href={config.url} style={{ textAlign: "center" }}>
                <h2>{config.url}</h2>
              </a>
              <div className="insights-title">
                <h4>
                  Device Type:{" "}
                  {config.deviceType === "mobile" ? "Mobile" : "Desktop"}
                </h4>
                <h4>
                  First contentful paint: {Math.round(fcp * 100) / 100} ms
                </h4>
                {config.waitTime ? (
                  <div>
                    <h4>Analysis Type: Timespan</h4>
                    <h4>Waiting Time: {config.waitTime} ms</h4>
                  </div>
                ) : (
                  <h4>Analysis Type: Navigation</h4>
                )}
              </div>
              <div className="to-hide">
                <ActionTable data={thirdPartyWithNetwork} />
              </div>

              {thirdPartyWithNetwork.map((item, idx) => {
                return (
                  <div key={idx} id={item.entityName.name}>
                    <h1 style={{ textAlign: "center" }}>
                      {item.entityName.name}
                    </h1>
                    <div className="table-container">
                      <Table
                        id={item.entityName.name}
                        headings={
                          renderBlockingResources
                            ? [
                              ...headings,
                              {
                                key: "renderBlocking",
                                text: "Render Blocking Time",
                                itemType: "ms",
                              },
                            ]
                            : headings
                        }
                        items={item.subItems.items.filter(
                          (item) => typeof item.url === "string"
                        )}
                        showPagination={false}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: "1em",
                        textAlign: "center",
                        marginBottom: "10em",
                      }}
                    >
                      {item.opportunities.user.length > 0 && (
                        <>
                          <h4> What You Can Do: </h4>
                          {item.opportunities.user.map((opportunity, idx) => {
                            return <p key={idx}>{opportunity}</p>;
                          })}
                        </>
                      )}

                      {item.opportunities.thirdParty.length > 0 && (
                        <>
                          <h4> What {item.entityName.name} Can Do: </h4>
                          {item.opportunities.thirdParty.map(
                            (opportunity, idx) => {
                              return <p key={idx}>{opportunity}</p>;
                            }
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
