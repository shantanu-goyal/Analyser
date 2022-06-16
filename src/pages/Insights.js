import React, { useContext, useRef } from "react";
import { Navigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { DataContext } from "../contexts/DataContext";
import BootupTimeInsights from "../components/BootupTimeInsights";
import MainThreadWorkInsights from "../components/MainThreadWorkInsights";
import NetworkRequestInsights from "../components/NetworkRequestInsights";
import NetworkRTTInsights from "../components/NetworkRTTInsights";
import ServerLatencyInsights from "../components/ServerLatencyInsights";
import ResourceSummaryInsights from "../components/ResourceSummaryInsights";
import ThirdPartyInsights from "../components/ThirdPartyInsights";
import "../styles/Insights.css";
import html2pdf from "html2pdf.js/src";
import jsPDF from "jspdf/dist/jspdf.es";

export default function Insights() {
  const dataContext = useContext(DataContext);
  const insightsRef = useRef(null);

  let data = dataContext.data.data;
  const bootupTimeData = data["bootup-time"];
  const mainThreadWorkData = data["mainthread-work-breakdown"];
  const networkRequestsData = data["network-requests"];
  const networkRTTData = data["network-rtt"];
  const serverLatencyData = data["network-server-latency"];
  const resourceData = data["resource-summary"];
  const thirdPartyData = dataContext.data.thirdParty;
  const config = dataContext.data.config;

  async function downloadReport() {
    const opt = {
      margin: [0, 0],
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
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
    for(let i=0;i < insightIds.length;i++) {
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
      if(i!==0)doc.addPage();
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
            <button onClick={downloadReport}>Download PDF</button>
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
              <BootupTimeInsights data={bootupTimeData} />
              <MainThreadWorkInsights data={mainThreadWorkData} />
              <NetworkRequestInsights data={networkRequestsData} />
              <NetworkRTTInsights data={networkRTTData} />
              <ServerLatencyInsights data={serverLatencyData} />
              <ResourceSummaryInsights data={resourceData} />

              <ThirdPartyInsights data={thirdPartyData} />
            </div>
            <div id="editor"></div>
          </div>
        </>
      )}
    </>
  );
}
