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



function transformData(data){
  let thirdPartyScripts=[];
  let domainScripts=[];
  data.map(item=>{
    if(item.entityName){
      thirdPartyScripts=[...thirdPartyScripts,...item.subItems.items]
    }
    else{
      domainScripts=[...domainScripts,item.entity.url]
    }
    return {};
  });
  domainScripts=domainScripts.filter(script=>{
    return script!=='other';
  })

  thirdPartyScripts=thirdPartyScripts.filter(script=>{
    return typeof(script.url)==="string";
  });
  return {
    thirdPartyScripts,
    domainScripts,
    userInput:[]
  };
}


export{getHostname, transformData, generateGraph};
