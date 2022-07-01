import html2pdf from "html2pdf.js/src";
import { useContext, useRef } from "react";
import { Navigate } from "react-router-dom";
import ActionTable from "../components/ActionTable";
import Button from "../components/Button";
import { NavBar } from "../components/NavBar";
import Table from "../components/Table";
import ThemeButton from "../components/ThemeButton";
import Title from "../components/Title";
import { DataContext } from "../contexts/DataContext";
import "../styles/Insights.css";
import {
  getEntityMappings,
  headings,
} from "../utility/insightsUtility";
export default function Insights() {
  const dataContext = useContext(DataContext);
  const insightsRef = useRef(null);

  let data,
    unminifiedJSData,
    unusedJSData,
    renderBlockingResources,
    thirdPartyData,
    config,
    fcp,
    thirdPartyWithNetwork,
    requestInitiators;
  try {
    data = dataContext.data.data;
    unminifiedJSData = data["unminified-javascript"];
    unusedJSData = data["unused-javascript"];
    renderBlockingResources = data["render-blocking-resources"];
    requestInitiators = data["request-initiators"];
    thirdPartyData = dataContext.data.insights;
    config = dataContext.data.config;
    fcp = data["first-contentful-paint"].numericValue;
    thirdPartyWithNetwork = getEntityMappings(
      requestInitiators,
      thirdPartyData,
      unminifiedJSData,
      renderBlockingResources,
      unusedJSData,
      fcp
    );
  } catch (err) {
    return <Navigate to="/" />;
  }

  async function downloadReport() {
    let divsToHide = document.getElementsByClassName("toolbar"); //divsToHide is an array
    let tableToHide = document.getElementsByClassName("to-hide");
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
    maxHeight = Math.min(1920, maxHeight);
    let displays = [];
    for (let i = 0; i < divsToHide.length; i++) {
      maxHeight = Math.max(maxHeight);
      displays.push(divsToHide[i].style.display);
      divsToHide[i].style.display = "none";
    }
    try {
      const opt = {
        filename: `${
          new URL(config.url).hostname +
          "-" +
          (config.waitTime ? "Timespan" : "Navigation")
        }.pdf`,
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
          <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
          </div>
          <Title heading={"Insights"}>
            <div className="insight-title" style={{ textAlign: "left" }}>
              <div>
                <b>URL: </b>
                <a href={config.url} style={{ textAlign: "center" }}>
                  {config.url}
                </a>
              </div>
              <div>
                <b>Device Type: </b>
                {config.deviceType === "mobile" ? "Mobile" : "Desktop"}
              </div>
              <div>
                <b>First contentful paint: </b>
                {Math.round(fcp * 100) / 100} ms
              </div>
              {config.waitTime ? (
                <div>
                  <b>Analysis Type: </b>Timespan
                </div>
              ) : (
                <div>
                  <b>Analysis Type: </b>Navigation
                </div>
              )}
              {config.waitTime ? (
                <div>
                  <b>Wait Time: </b>
                  {config.waitTime} ms
                </div>
              ) : (
                <></>
              )}
            </div>
          </Title>
          {thirdPartyWithNetwork.length > 0 ? (
            <>
              <div className="download-btn">
                <Button onClick={downloadReport}>Download PDF</Button>
              </div>
              <div className="to-hide">
                <ActionTable data={thirdPartyWithNetwork} />
              </div>
              <div className="insights-wrapper" ref={insightsRef}>
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
            </>
          ) : (
            <h2 style={{ textAlign: "center" }}>Nothing To Show Here...</h2>
          )}
        </>
      )}
    </>
  );
}
