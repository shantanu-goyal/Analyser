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
  console.log(
    "🚀 ~ file: Insights.js ~ line 20 ~ Insights ~ resourceData",
    resourceData
  );
  //   const thirdPartyData = data["third-party-summary"];

  //   function extractBootupTimeData(data) {
  //     const details = data["bootup-time"].details;
  //     const result = details.items
  //       .map((item) => {
  //         if (item.total > 2000) {
  //           return { url: item.url, total: item.total };
  //         }
  //         return {};
  //       })
  //       .filter((value) => Object.keys(value).length !== 0);
  //     const finalResult = {
  //       data: result,
  //       suggestions: [
  //         "Only send the code that your users need by implementing code splitting",
  //         "Minify and compress your code.",
  //         "Remove unused code",
  //         "Reduce network trips by caching your code with the PRPL pattern",
  //       ],
  //     };
  //     return finalResult;
  //   }

  //   function extractMainThreadWorkBreakDownData(data) {
  //     const details = data["mainthread-work-breakdown"].details;
  //     const result = details.items
  //       .map((item) => {
  //         if (item.duration > 4000) {
  //           return {
  //             total: item.duration,
  //             groupLabel: item.groupLabel,
  //           };
  //         }
  //         return {};
  //       })
  //       .filter((value) => Object.keys(value).length !== 0);
  //     for (let i = 0; i < result.length; i++) {
  //       if (result[i].groupLabel === "Script Evaluation") {
  //         result[i] = {
  //           ...result[i],
  //           suggestions: [
  //             "Optimize third-party JavaScript",
  //             "Debounce your input handlers",
  //             "Use web workers",
  //           ],
  //         };
  //       } else if (result[i].groupLabel === "Style & Layout") {
  //         result[i] = {
  //           ...result[i],
  //           suggestions: [""],
  //         };
  //       } else if (result[i].groupLabel === "Other") {
  //         result[i] = {
  //           ...result[i],
  //           suggestions: [
  //             "Reduce the scope and complexity of style calculations",
  //             "Avoid large, complex layouts and layout thrashing",
  //           ],
  //         };
  //       } else if (result[i].groupLabel === "Rendering") {
  //         result[i] = {
  //           ...result[i],
  //           suggestions: [
  //             "Stick to compositor only properties and manage layer count",
  //             "Simplify paint complexity and reduce paint areas",
  //           ],
  //         };
  //       } else if (result[i].groupLabel === "Script Parsing & Compilation") {
  //         result[i] = {
  //           ...result[i],
  //           suggestions: [
  //             "Reduce JavaScript payloads with code splitting",
  //             "Remove unused code",
  //           ],
  //         };
  //       } else if (result[i].groupLabel === "Parse HTML & CSS") {
  //         result[i] = {
  //           ...result[i],
  //           suggestions: [
  //             "Extract critical CSS",
  //             "Minify CSS",
  //             "Defer non-critical CSS",
  //           ],
  //         };
  //       } else if (result[i].groupLabel === "Garbage Collection") {
  //         result[i] = {
  //           ...result[i],
  //           suggestions: [
  //             "Monitor your web page's total memory usage with measureMemory()",
  //           ],
  //         };
  //       }
  //     }
  //     return result;
  //   }

  //   function extractNetworkRoundTripTime(data) {
  //     const details = data["network-rtt"].details;
  //     const result = details.items
  //       .map((item) => {
  //         if (item.rtt > 100) {
  //           return {
  //             origin: item.origin,
  //             total: item.rtt,
  //           };
  //         }
  //         return {};
  //       })
  //       .filter((value) => Object.keys(value).length !== 0);
  //     const finalResult = {
  //       data: result,
  //       suggestions: [
  //         "Try to use a CDN. CDN is able to optimize network pathways between locations, resulting in reduced RTT and improved latency for visitors accessing content cached inside the CDN.",
  //       ],
  //     };
  //     return finalResult;
  //   }

  //   function extractNetworkServerLatencyData(data) {
  //     const details = data["network-server-latency"].details;
  //     const result = details.items
  //       .map((item) => {
  //         if (item.serverResponseTime > 150) {
  //           return {
  //             total: item.serverResponseTime,
  //             origin: item.origin,
  //           };
  //         }
  //         return {};
  //       })
  //       .filter((values) => Object.keys(values).length !== 0);
  //     const finalResult = {
  //       data: result,
  //       suggestions: [
  //         "Subnetting is another way to help reduce latency across your network, by grouping together endpoints that communicate most frequently with each other.",
  //         "Additionally, you could use traffic shaping and bandwidth allocation to improve latency for the business-critical parts of your network",
  //         "Finally, you can use a load balancer to help offload traffic to parts of the network with the capacity to handle some additional activity",
  //       ],
  //     };
  //     return finalResult;
  //   }

  //   function extractResourceSummaryData(data) {
  //     const details = data["resource-summary"].details;
  //     const result = details.items.map((item) => {
  //       if (item.label === "Script") {
  //         return {
  //           ...item,
  //           suggestions: [
  //             "Apply instant loading with the PRPL pattern",
  //             "Reduce JavaScript payloads with code splitting",
  //             "Remove unused code",
  //             "Minify and compress network payloads",
  //             "Serve modern code to modern browsers for faster page loads",
  //             "Publish, ship, and install modern JavaScript for faster applications",
  //           ],
  //         };
  //       } else if (item.label === "Image") {
  //         return {
  //           ...item,
  //           suggestions: [
  //             "Choose the right image format",
  //             "Choose the correct level of compression",
  //             "Use Imagemin to compress images",
  //             "Replace animated GIFs with video for faster page loads",
  //             "Serve responsive images",
  //             "Serve images with correct dimensions",
  //             "Use WebP images",
  //             "Use image CDNs to optimize images",
  //           ],
  //         };
  //       } else {
  //         return {
  //           ...item,
  //         };
  //       }
  //     });
  //     return result;
  //   }

  //   function extractThirdPartySummaryData(data) {
  //     const details = data["third-party-summary"].details;
  //     const results = details.items
  //       .map((item) => {
  //         if (item.mainThreadTime > 100) {
  //           return {
  //             entity: item.entity,
  //             total: item.mainThreadTime,
  //           };
  //         }
  //         return {};
  //       })
  //       .filter((values) => Object.keys(values).length !== 0);
  //     const finalResult = {
  //       data: results,
  //       suggestions: ["Try to move third party scripts to PartyTown"],
  //     };
  //     return finalResult;
  //   }

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
