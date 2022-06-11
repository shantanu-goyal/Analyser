import { Routes, Route, Navigate } from "react-router-dom";
import DataContextProvider from "../contexts/DataContext";
import BootupTime from "./BootupTime";
import MainThreadWorkBreakdown from "./MainThreadWorkBreakDown";
import NetworkRequests from "./NetworkRequests";
import NetworkRTT from "./NetworkRTT";
import NetworkServerLatency from "./NetworkServerLatency";
import ResourceSummary from "./ResourcSummary";
import Home from "../pages/Home";
import ThirdPartySummary from "./ThirdPartySummary";
import React from "react";
export default function App() {
  return (
    <>
      <DataContextProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/bootup-time" element={<BootupTime />}></Route>
          <Route
            path="/mainthread-work-breakdown"
            element={<MainThreadWorkBreakdown />}
          ></Route>
          <Route path="/network-requests" element={<NetworkRequests />}></Route>
          <Route path="/network-rtt" element={<NetworkRTT />}></Route>
          <Route
            path="/network-server-latency"
            element={<NetworkServerLatency />}
          ></Route>
          <Route path="/resource-summary" element={<ResourceSummary />}></Route>
          <Route
            path="/third-party-summary"
            element={<ThirdPartySummary />}
          ></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </DataContextProvider>
    </>
  );
}
