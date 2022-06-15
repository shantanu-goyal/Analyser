import { Routes, Route} from "react-router-dom";
import React, { Suspense, lazy } from "react";
import DataContextProvider from "./contexts/DataContext";
import ThirdPartySummary from "./pages/ThirdPartySummary";
// Code Splitting
const BootupTime = lazy(() => import("./pages/BootupTime"));
const MainThreadWorkBreakdown = lazy(() => import("./pages/MainThreadWorkBreakDown"));
const NetworkRequests = lazy(() => import("./pages/NetworkRequests"));
const NetworkRTT = lazy(() => import("./pages/NetworkRTT"));
const NetworkServerLatency = lazy(() => import("./pages/NetworkServerLatency"));
const ResourceSummary = lazy(() => import("./pages/ResourceSummary"));
const Home = lazy(() => import("./pages/Home"))
const Insights =lazy(()=>import("./pages/Insights"));
/**
 * The main component of the application that renders the different components. It also handles the routing of the different components.
 * @returns {JSX} - The JSX to be rendered
 */
export default function App() {
  return (
    <>
      <DataContextProvider>
        <Suspense fallback={<div>Loading...</div>}>
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
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </Suspense>
      </DataContextProvider>
    </>
  );
}
