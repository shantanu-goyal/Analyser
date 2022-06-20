import React, { useContext, useRef } from "react";
import { Navigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { DataContext } from "../contexts/DataContext";
import Table from "../components/Table";
import { getOpportunities } from "../utility/insightsUtility";

import "../styles/Insights.css";
import html2pdf from "html2pdf.js/src";
import jsPDF from "jspdf/dist/jspdf.es";

export default function Insights() {
  const dataContext = useContext(DataContext);
  const insightsRef = useRef(null);

  let data = dataContext.data.data;
  const unminifiedJSData = data["unminified-javascript"];
  const unusedJSData = data["unused-javascript"];
  const renderBlockingResources = data["render-blocking-resources"];
  const thirdPartyData = dataContext.data.insights;
  const config = dataContext.data.config;

  const thirdPartyWithNetwork = thirdPartyData
    .reduce((acc, item) => {
      if (!item.entityName) return acc;
      let prevItem = acc.find(
        ({ entityName }) => item.entityName === entityName
      );
      let summary = {
        url: "Summary",
        mainThreadTime: 0,
        blockingTime: 0,
        transferSize: 0,
        resourceSize: 0,
        minified: "Yes",
        unusedPercentage: 0,
      };
      let renderBlockingSummary = 0;
      let newItems = [];
      item.subItems.items.forEach((subitem) => {
        if (typeof subitem.url !== "string") return;
        if (
          unminifiedJSData.details.items.find(({ url }) => url === subitem.url)
        ) {
          subitem.minified = "No";
          summary.minified = "No";
        } else subitem.minified = "Yes";
        if (renderBlockingResources) {
          let renderBlockingResource =
            renderBlockingResources.details.items.find(
              ({ url }) => url === subitem.url
            );
          if (renderBlockingResource) {
            subitem.renderBlocking = renderBlockingResource.wastedMs;
            renderBlockingSummary += renderBlockingResource.wastedMs;
          } else subitem.renderBlocking = 0;
        }
        let js = unusedJSData.details.items.find(
          ({ url }) => url === subitem.url
        );
        if (js) {
          subitem.unusedPercentage = js.wastedPercent;
          summary.unusedPercentage += js.wastedBytes;
        } else subitem.unusedPercentage = 0;
        summary.mainThreadTime += subitem.mainThreadTime;
        summary.blockingTime += subitem.blockingTime;
        summary.transferSize += subitem.transferSize;
        summary.resourceSize += subitem.resourceSize;
        newItems.push(subitem);
      });
      // item.subItems.items.push(summary)
      if (prevItem) {
        let prevNumSubItems = prevItem.subItems.items.length;
        let prevSummary = prevItem.subItems.items[prevNumSubItems - 1];
        summary.mainThreadTime += prevSummary.mainThreadTime;
        summary.blockingTime += prevSummary.blockingTime;
        renderBlockingSummary += prevSummary.renderBlocking;
        summary.transferSize += prevSummary.transferSize;
        summary.resourceSize += prevSummary.resourceSize;
        summary.minified =
          prevSummary.minified === "No" ? "No" : summary.minified;
        summary.unusedPercentage =
          (((prevSummary.unusedPercentage * prevSummary.transferSize) / 100 +
            summary.unusedPercentage) /
            summary.transferSize) *
          100;
        let opportunities = getOpportunities(
          summary,
          newItems.length + prevNumSubItems - 1
        );
        prevItem.subItems.items.pop();
        prevItem.subItems.items = renderBlockingResources
          ? [
              ...prevItem.subItems.items,
              ...newItems,
              { ...summary, renderBlocking: renderBlockingSummary },
            ]
          : [...prevItem.subItems.items, ...newItems, summary];
        prevItem.opportunities = opportunities;
        return acc;
      }
      summary.unusedPercentage =
        (summary.unusedPercentage / summary.transferSize) * 100;

      let opportunities = getOpportunities(summary, newItems.length);
      return [
        ...acc,
        {
          ...item,
          subItems: {
            ...item.subItems,
            items: renderBlockingResources
              ? [
                  ...item.subItems.items,
                  { ...summary, renderBlocking: renderBlockingSummary },
                ]
              : [...item.subItems.items, summary],
          },
          opportunities,
        },
      ];
    }, [])
    .sort(
      (a, b) =>
        b.subItems.items.at(-1).mainThreadTime -
          a.subItems.items.at(-1).mainThreadTime ||
        b.subItems.items.at(-1).blockingTime -
          a.subItems.items.at(-1).blockingTime ||
        b.subItems.items.at(-1).transferSize -
          a.subItems.items.at(-1).transferSize ||
        b.subItems.items.at(-1).resourceSize -
          a.subItems.items.at(-1).resourceSize
    );

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
  ];

  async function downloadReport() {
    const opt = {
      margin: [0, 0],
      image: { type: "jpeg", quality: 1 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: "in", format: "letter", orientation: "l" },
    };
    const doc = new jsPDF(opt.jsPDF);
    const pageSize = jsPDF.getPageSize(opt.jsPDF);
    const insightIds = [
      "bootupTimeInsights",
      "mainThreadWorkInsights",
      "networkReuestInsights",
      "networkRTTInsights",
      "resourceSummaryInsights",
      "serverLatencyInsights",
      "thirdPartyInsights",
    ];
    for (let i = 0; i < insightIds.length; i++) {
      const pageImage = await html2pdf()
        .from(document.getElementById(insightIds[i]))
        .set(opt)
        .outputImg();
      doc.addImage(
        pageImage.src,
        "jpeg",
        opt.margin[0],
        opt.margin[1],
        pageSize.width,
        pageSize.height
      );
      doc.addPage();
    }
    doc.save("report.pdf");
  }

  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <>
          <NavBar />
          <div className="insights-wrapper">
            <button className="insights-button" onClick={downloadReport}>
              Download PDF
            </button>
            <div className="insights-wrapper" ref={insightsRef}>
              <a href={config.url} style={{ textAlign: "center" }}>
                <h2>{config.url}</h2>
              </a>
              <div className="insights-title">
                <h4>
                  Device Type:{" "}
                  {config.deviceType === "mobile" ? "Mobile" : "Desktop"}
                </h4>
                <h4>Analysis Time: {config.waitTime} ms</h4>
              </div>

              {thirdPartyWithNetwork.map((item, idx) => {
                return (
                  <div key={idx}>
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
                      <h4> What You Can Do: </h4>
                      {item.opportunities.user.map((opportunity, idx) => {
                        return <p key={idx}>{opportunity}</p>;
                      })}
                      <h4> What {item.entityName.name} Can Do: </h4>
                      {item.opportunities.thirdParty.map((opportunity, idx) => {
                        return <p key={idx}>{opportunity}</p>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div id="editor"></div>
          </div>
        </>
      )}
    </>
  );
}
