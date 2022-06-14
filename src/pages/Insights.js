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

export default function Insights() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  const bootupTimeData = data["bootup-time"];
  const mainThreadWorkData = data["mainthread-work-breakdown"];
  const networkRequestsData = data["network-requests"];
  const networkRTTData = data["network-rtt"];
  const serverLatencyData = data["network-server-latency"];
  const resourceData = data["resource-summary"];

  return (
    <>
      {!data && <Navigate to="/" />}
      {data && (
        <div>
          <NavBar />
          <BootupTimeInsights data={bootupTimeData} />
          <MainThreadWorkInsights data={mainThreadWorkData} />
          <NetworkRequestInsights data={networkRequestsData} />
          <NetworkRTTInsights data={networkRTTData} />
          <ServerLatencyInsights data={serverLatencyData} />
          <ResourceSummaryInsights data={resourceData} />
        </div>
      )}
    </>
  );
}
