import React, { useContext } from "react";
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
import '../styles/Insights.css'

export default function Insights() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  const bootupTimeData = data["bootup-time"];
  const mainThreadWorkData = data["mainthread-work-breakdown"];
  const networkRequestsData = data["network-requests"];
  const networkRTTData = data["network-rtt"];
  const serverLatencyData = data["network-server-latency"];
  const resourceData = data["resource-summary"];
  const thirdPartyData = dataContext.data.thirdParty;
  const config = dataContext.data.config;
  console.log(
    "🚀 ~ file: Insights.js ~ line 23 ~ Insights ~ thirdPartyData",
    thirdPartyData
  );

  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <div>
          <NavBar />
          <a href={config.url} style={{textAlign: 'center'}}>
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
      )}
    </>
  );
}
