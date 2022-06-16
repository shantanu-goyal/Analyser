import {thirdPartyWeb} from '../utility/third-party-web/entity-finder-api'
import DoughnutChart from '../components/Graphs/DoughnutChart'

/**
 * Function to extract the main thread time from scripts
 * @param {Array} scripts 
 * @returns {Array} - Array of objects containing the url of the script along with its main thread time. 
 */
function getMainThreadTime(scripts) {
  const result = scripts.map(script => {
    return {
      url: script.url,
      data: script.data.mainThreadTime
    }
  }).filter(script => script.data > 0);
  return result;
}

/**
 * Function to extract the render blocking time from scripts
 * @param {Array} scripts 
 * @returns {Array} - Array of objects containing the url of the script along with its render blocking time. 
 */
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
 * @param {Array} scripts - The data corresponding to the third party scripts
 * @param {String} value - The type of the graph to be generated
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


/**
 * Function that returns the hostname of the url if its a valid url. Else it returns null
 * @param {String} url 
 * @returns hostname or null
 */
function getHostname(url){
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches && matches[1];
}



/**
 * Function transforms the data 
 * 
 * @param {object} data - Object containing metrics of all scripts
 * @returns {object} - Scripts, Third Party Scripts, Scripts which are not third party and available for the user to mark, Entities and their metrics, mapping of entity to different scripts
 */
function transformData(data) {
    let items = data.details;

    // Getting all scripts from the data
    const scripts = items.map(item => {
      return {
        url: item[0],
        data: item[1]
      }
    })

    // Initialising third party script array
    const thirdPartyScripts = [];
    
    // Initialising a map mapping entity to its metrics
    const byEntity = new Map();
    
    // Initialising a map mapping entity to its related scripts
    const entityWiseScripts=new Map();
    
    // Map mapping domains that are not third party
    const domains=new Map();

    scripts.forEach(script => {
      // Get the hostname for each script 
      let scriptURL = getHostname(script.url);
      if(!scriptURL){
        return;
      }
      
      // Check if entity is present in the third party web database
      let entity = thirdPartyWeb.getEntity(scriptURL);
      
      // Get the data from the script (metrics)
      let scriptData = script.data;
      
      // Default metrics for entity 
      const defaultConfig = {
        mainThreadTime: 0,
        blockingTime: 0,
        transferSize: 0
      }
      
      if (entity) {
        // Push current script into third party script array 
        thirdPartyScripts.push(script);
        
        // Check if we have metrics related to that entity
        const currentEntity = byEntity.get(entity.name) || { ...defaultConfig };
        
        // Check if we have scripts related to that entity
        const scriptForEntity=entityWiseScripts.get(entity.name)||[];
        
        // Push the current script in the scripts related to the entity 
        scriptForEntity.push(script.url);
        
        // Update the scripts in the map
        entityWiseScripts.set(entity.name, scriptForEntity);
        
        // Update the metrics
        currentEntity.mainThreadTime += scriptData.mainThreadTime;
        currentEntity.blockingTime += scriptData.blockingTime;
        currentEntity.transferSize += scriptData.transferSize;

        // Update the metrics in the map
        byEntity.set(entity.name, currentEntity);
      }
      else{
        // Mark it as a dropdown script
        domains.set(scriptURL,1);
      }
    })
    const entities = Array.from(byEntity.entries());
    const domainWiseScripts=Array.from(domains.keys());
    const mapping=Array.from(entityWiseScripts.entries());
    return { domainWiseScripts, entities, scripts, thirdPartyScripts,mapping};
  }



export{getHostname, transformData, generateGraph};
