import {thirdPartyWeb} from '../utility/third-party-web/entity-finder-api'
import DoughnutChart from '../components/Graphs/DoughnutChart'

function getMainThreadTime(scripts) {
  const result = scripts.map(script => {
    return {
      url: script.url,
      data: script.data.mainThreadTime
    }
  }).filter(script => script.data > 0);
  return result;
}


function getRenderBlockingTime(scripts) {
  const result = scripts.map(script => {
    return {
      url: script.url,
      data: script.data.blockingTime
    }
  }).filter(script => script.data > 0);
  return result;
}

/**
 * Function to generate the graph
 *
 * @param {object} data - The data corresponding to the graph
 * @param {string} value - The type of the graph to be generated
 * @returns {JSX} - The graph corresponding to the type of the graph requested by the user
 */
function generateGraph(scripts, value) {
  const mainThreadTimeData = getMainThreadTime(scripts);
  const blockingTimeData = getRenderBlockingTime(scripts);
  // If user requests blocking time graph
  if (value === "blocking") {
    if (blockingTimeData.length > 0) {
      return (
        <DoughnutChart
          title={"Render Blocking Time"}
          data={blockingTimeData}
        ></DoughnutChart>
      );
    } else {
      return <></>;
    }
  }
  // If user requests main thread time graph
  else {
    if (mainThreadTimeData.length > 0) {
      return (
        <DoughnutChart title={"Main Thread Time"} data={mainThreadTimeData} />
      );
    } else {
      return <></>;
    }
  }
}



function getHostname(url){
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches && matches[1];
}


function transformData(data) {
    let items = data.details;
    const scripts = items.map(item => {
      return {
        url: item[0],
        data: item[1]
      }
    })
    const thirdPartyScripts = [];
    const byEntity = new Map();
    const entityWiseScripts=new Map();
    const domains=new Map();
    scripts.forEach(script => {
      let scriptURL = getHostname(script.url);
      if(!scriptURL){
        return {};
      }
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
        const scriptForEntity=entityWiseScripts.get(entity.name)||[];
        scriptForEntity.push(script.url);
        entityWiseScripts.set(entity.name, scriptForEntity);
        currentEntity.mainThreadTime += scriptData.mainThreadTime;
        currentEntity.blockingTime += scriptData.blockingTime;
        currentEntity.transferSize += scriptData.transferSize;
        byEntity.set(entity.name, currentEntity);
      }
      else{
        domains.set(scriptURL,1);
      }
    })
    const entities = Array.from(byEntity.entries());
    const domainWiseScripts=Array.from(domains.keys());
    const mapping=Array.from(entityWiseScripts.entries());
    return { domainWiseScripts, entities, scripts, thirdPartyScripts,mapping};
  }

export{getHostname, transformData, generateGraph};
