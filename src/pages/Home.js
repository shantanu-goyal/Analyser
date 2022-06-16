import axios from "axios";
import React, { useContext, useState } from "react";
import {thirdPartyWeb} from '../utility/third-party-web/entity-finder-api'
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { REACT_APP_SERVER_URL } from "../config";
import { DataContext } from "../contexts/DataContext";
import "../styles/Home.css";

/**
 * Function to return JSX for Home page
 * @returns jsx for the form element Home
 */
export default function Home() {
  // Global datacontext for the website
  const dataContext = useContext(DataContext);
  // State to indicate the status o form i.e. submitted or not submitted
  const [formSubmitted, setFormSubmitted] = useState(false);
  // State to indicate whther data is currently loading
  const [loading, setLoading] = useState(false);
  // State to indicate whether an error occured during data fetching
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  
  const getHostname = (url) => {
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches && matches[1];
  } 

  function getThirdPartyData(data){
    let items = data.details;
    const scripts = items.map(item => {
      return {
        url: item[0],
        data: item[1]
      }
    })
    const thirdPartyScripts = [];
    const byEntity = new Map();
    const domains=new Map();
    scripts.forEach(script => {
      let scriptURL = getHostname(script.url);
      if(!scriptURL){
        return {};
      }
      domains.set(scriptURL,1);
      let entity = thirdPartyWeb.getEntity(scriptURL);
      let scriptData = script.data;
      const defaultConfig = {
        mainThreadTime: 0,
        blockingTime: 0,
        transferSize: 0
      }
      if (entity) {
        thirdPartyScripts.push(script);
        const currentEntity = byEntity.get(entity.name) || { ...defaultConfig };
        currentEntity.mainThreadTime += scriptData.mainThreadTime;
        currentEntity.blockingTime += scriptData.blockingTime;
        currentEntity.transferSize += scriptData.transferSize;
        byEntity.set(entity.name, currentEntity);
      }
    })
    const entities = Array.from(byEntity.entries());
    const domainWiseScripts=Array.from(domains.keys());
    return {entities, scripts, thirdPartyScripts, userInput:[]};
  }


  /**
   * Function to manage states on form submission and fetch data
   * @param {String} url Url of website
   * @param {Object} headers Headers that need to be sent in request along with url
   * @param {String} formFactor Type of device
   */
  async function onFormSubmit(url, headers, formFactor, waitTime) {
    setFormSubmitted(true);
    setLoading(true);
    try {
      const result = await axios.get(REACT_APP_SERVER_URL, {
        method: "GET",
        params: {
          url,
          headers,
          formFactor,
          waitTime
        },
      });
      console.log(result.data)
      setLoading(false);
      const thirdParty=getThirdPartyData(result.data['third-party-summary']);
      dataContext.setData({ type: "changeData", 
      data:{
          data:result.data,
          thirdParty:thirdParty
        }
      });
      navigate("/bootup-time");
    } catch (error) {
      setError(true);
      console.log(error);
    }
  }

  return (
    <div className="container">
      {!formSubmitted && <Form onFormSubmit={onFormSubmit} />}
      {formSubmitted && loading && !error && <div className="loader"></div>}
      {formSubmitted && error && <h1>Error..</h1>}
    </div>
  );
}
