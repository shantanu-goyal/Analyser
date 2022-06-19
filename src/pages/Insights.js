import React, { useContext, useRef } from "react";
import { Navigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { DataContext } from "../contexts/DataContext";
import Table from "../components/Table";
import { thirdPartyWeb } from "../utility/third-party-web/entity-finder-api";
import { getOpportunities } from "../utility/insightsUtility";

import "../styles/Insights.css";
import html2pdf from "html2pdf.js/src";
import jsPDF from "jspdf/dist/jspdf.es";

export default function Insights() {
  const dataContext = useContext(DataContext);
  const insightsRef = useRef(null);

  let data = dataContext.data.data;
  const networkRTTData = data["network-rtt"];
  const serverLatencyData = data["network-server-latency"];
  const thirdPartyData = dataContext.data.thirdParty;
  const config = dataContext.data.config;

  function getThirdPartyData() {
    const thirdPartyWithNetwork = thirdPartyData.map((item) => {
      let numValidSubIems = 0
      let summary = {
        url: "Summary",
        mainThreadTime: 0,
        blockingTime: 0,
        transferSize: 0,
        resourceSize: 0,
        rtt: 0,
        serverResponseTime: 0,
      };
      item.subItems.items.forEach((subitem) => {
        if (typeof subitem.url !== "string") return;
        let rttOrigin = networkRTTData.details.items.find(
          ({ origin }) =>
            thirdPartyWeb.getRootDomain(origin) ===
            thirdPartyWeb.getRootDomain(subitem.url)
        );
        let latencyOrigin = serverLatencyData.details.items.find(
          ({ origin }) =>
            thirdPartyWeb.getRootDomain(origin) ===
            thirdPartyWeb.getRootDomain(subitem.url)
        );
        subitem.rtt = rttOrigin ? rttOrigin.rtt : 0;
        subitem.serverResponseTime = latencyOrigin
          ? latencyOrigin.serverResponseTime
          : 0;
        summary.mainThreadTime += subitem.mainThreadTime;
        summary.blockingTime += subitem.blockingTime;
        summary.transferSize += subitem.transferSize;
        summary.resourceSize += subitem.resourceSize;
        summary.rtt = Math.max(summary.rtt, subitem.rtt);
        summary.serverResponseTime = Math.max(
          summary.serverResponseTime,
          subitem.serverResponseTime
        );
        numValidSubIems += 1
       
      });
      // item.subItems.items.push(summary)
      let opportunities = getOpportunities(summary, numValidSubIems);
      return {
        ...item,
        subItems: {
          ...item.subItems,
          items: [...item.subItems.items, summary],
        },
        opportunities
      };
    });

    return thirdPartyWithNetwork;
  }

  const headings = [
    { key: "url", text: "URL", itemType: "link" },
    { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
    { key: "blockingTime", text: "Main Thread Blocking Time", itemType: "ms" },
    { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
    { key: "resourceSize", text: "Resource Size", itemType: "bytes" },
    { key: "rtt", text: "Server RTT", itemType: "ms" },
    {
      key: "serverResponseTime",
      text: "Server Backend Latency",
      itemType: "ms",
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

              {getThirdPartyData().map((item) => {
                return (
                  item.entityName && (
                    <div style={{ marginTop: "10em" }} key={item.entityName.name}>
                      <h1 style={{ textAlign: "center" }}>
                        {item.entityName.name}
                      </h1>
                      <div
                        className="table-container"
                        
                      >
                        <Table
                          id={item.entityName.name}
                          headings={headings}
                          items={item.subItems.items.filter(
                            (item) => typeof item.url === "string"
                          )}
                          showPagination={false}
                        />
                      </div>
                      <h4> What You Can Do: </h4>
                      {item.opportunities.user.map((opportunity, idx) => {
                        return (<p key={idx}>{opportunity}</p>)
                      })}
                      <h4> What {item.entityName.name} Can Do: </h4>
                      {item.opportunities.thirdParty.map((opportunity, idx) => {
                        return (<p key={idx}>{opportunity}</p>)
                      })}
                    </div>
                  )
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
