import {thirdPartyWeb} from '../utility/third-party-web/entity-finder-api'

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
        const scriptForEntity=entityWiseScripts.get(entity.name)||[];
        scriptForEntity.push(script.url);
        entityWiseScripts.set(entity.name, scriptForEntity);
        currentEntity.mainThreadTime += scriptData.mainThreadTime;
        currentEntity.blockingTime += scriptData.blockingTime;
        currentEntity.transferSize += scriptData.transferSize;
        byEntity.set(entity.name, currentEntity);
      }
    })
    const entities = Array.from(byEntity.entries());
    const domainWiseScripts=Array.from(domains.keys());
    const mapping=Array.from(entityWiseScripts.entries());
    return { domainWiseScripts, entities, scripts, thirdPartyScripts,mapping};
  }

export{getHostname, transformData};
