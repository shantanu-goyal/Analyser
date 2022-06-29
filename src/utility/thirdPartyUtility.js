import Bar from '../components/Graphs/Bar'

/**
 * Function to extract the main thread time from scripts
 * @param {Array} scripts 
 * @returns {Array} - Array of objects containing the url of the script along with its main thread time. 
 */
function getMainThreadTime(scripts) {
  const result = scripts.map(script => {
    return {
      url: script.url,
      data: script.mainThreadTime
    }
  }).filter(script => script.data > 0);
  return {result, type:"ms"};
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
      data: script.blockingTime
    }
  }).filter(script => script.data > 0);
  return {result, type:"ms"};
}

function getTransferSize(scripts){
  const result = scripts.map(script => {
    return {
      url: script.url,
      data: script.transferSize/1024
    }
  }).filter(script => script.data > 0);
  return {result, type:"kb"}; 
}

function getResourceSize(scripts){
  const result = scripts.map(script => {
    return {
      url: script.url,
      data: script.resourceSize/1024
    }
  }).filter(script => script.data > 0);
  return {result, type:"kb"};
}



/**
 * Function to generate the graph
 *
 * @param {Array} scripts - The data corresponding to the third party scripts
 * @param {String} value - The type of the graph to be generated
 * @returns {JSX} - The graph corresponding to the type of the graph requested by the user
 */
function generateGraph(scripts, value,type="doughnut") {
  const mainThreadTimeData = getMainThreadTime(scripts);
  const blockingTimeData = getRenderBlockingTime(scripts);
  const resourceSizeData=getResourceSize(scripts);
  const transferSizeData=getTransferSize(scripts);
  // If user requests blocking time graph
  if (value === "blocking") {
    if (blockingTimeData.result.length > 0) {
      return (
        <Bar
          title={"Main Thread Blocking Time"}
          data={blockingTimeData}
        ></Bar>
      );
    } else {
      return <h3 style={{textAlign:"center", color:"var(--color-text)"}}>Nothing to show here...</h3>;
    }
  }
  // If user requests resource size graph
  else if(value==="resource"){
    if (resourceSizeData.result.length > 0) {
      return (
        <Bar
          title={"Resource Size"}
          data={resourceSizeData}
        ></Bar>
      );
    } else {
      return <h3 style={{textAlign:"center", color:"var(--color-text)"}}>Nothing to show here...</h3>;
    }
  }

  // If user requests transfer size graph
  else if(value==="transfer"){
    if (transferSizeData.result.length > 0) {
      return (
        <Bar
          title={"Transfer Size"}
          data={transferSizeData}
        ></Bar>
      );
    } else {
      return <h3 style={{textAlign:"center", color:"var(--color-text)"}}>Nothing to show here...</h3>;
    }
  }

  // If user requests main thread time graph
  else {
    if (mainThreadTimeData.result.length > 0) {
      return (
        <Bar title={"Main Thread Time"} data={mainThreadTimeData} />
      );
    } else {
      return <h3 style={{textAlign:"center", color:"var(--color-text)"}}>Nothing to show here...</h3>;
    }
  }
}


/**
 * Function that returns the hostname of the url if its a valid url. Else it returns null
 * @param {String} url 
 * @returns hostname or null
 */
function getHostname(url){
    //eslint-disable-next-line
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
