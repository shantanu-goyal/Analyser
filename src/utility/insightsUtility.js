const visited = new Map();

function getOpportunities(
  {
    mainThreadTime,
    blockingTime,
    transferSize,
    resourceSize,
    minified,
    unusedPercentage,
    startTime,
    renderBlocking,
  },
  numItems,
  fcp
) {
  const opportunities = {
    user: [],
    thirdParty: [],
  };
  if (mainThreadTime / numItems > 50) {
    let opp = `Move scripts to web workers to save ${Math.round(mainThreadTime * 100) / 100
      } ms of main thread time`;
    if (blockingTime > 0)
      opp += ` and to remove main-thread blocking time of ${Math.round(blockingTime * 100) / 100
        } ms`;
    opportunities.user.push(opp);
  }
  if (blockingTime > 0) {
    if (mainThreadTime / numItems <= 50) {
      opportunities.user.push(
        `Move scripts to web workers to remove main-thread blocking time of ${Math.round(blockingTime * 100) / 100
        } ms`
      );
      opportunities.thirdParty.push(
        "Optimise task execution time, try to split longer tasks into smaller ones to reduce blocking time "
      );
    }
  }

  if (unusedPercentage > 0) {
    opportunities.thirdParty.push(
      "Use code splitting to allow users reduce main-thread time and network time by importing and executing critical chunks"
    );
  }
  if (unusedPercentage > 50 || startTime <= fcp + 500) {
    opportunities.user.push("Lazyload scripts which are not critical");
  }
  if (minified === "No") {
    let opp = "Minify";
    if (resourceSize / transferSize < 2) {
      opp += ` and compress`;
    }
    opp += " scripts to reduce parsing and network time";
    opportunities.thirdParty.push(opp);
    opportunities.user.push(
      "Use minified scripts to reduce parsing and network time"
    );
  }
  if (renderBlocking) {
    opportunities.user.push(
      `Use async and defer for non-critical scripts to reduce render Blocking time`
    );
  }
  return opportunities;
}

function getSummary(item) {
  const summary = {
    url: "Summary",
    mainThreadTime: 0,
    blockingTime: 0,
    transferSize: 0,
    resourceSize: 0,
    minified: "Yes",
    unusedPercentage: 100,
  };
  let minStartTime = 1000000;
  item.subItems.items.forEach((subitem) => {
    summary.mainThreadTime += subitem.mainThreadTime;
    summary.blockingTime += subitem.blockingTime;
    summary.resourceSize += subitem.resourceSize;
    summary.minified = summary.minified === "No" ? "No" : subitem.minified;
    summary.unusedPercentage =
      (summary.unusedPercentage * summary.transferSize +
        subitem.unusedPercentage * subitem.transferSize) /
      (summary.transferSize + subitem.transferSize);
    summary.transferSize += subitem.transferSize;
    if (subitem.renderBlocking !== undefined)
      summary.renderBlocking = summary.renderBlocking
        ? summary.renderBlocking + subitem.renderBlocking
        : subitem.renderBlocking;
    minStartTime = subitem.intervals.length > 0 ?  Math.min(minStartTime, subitem.intervals[0].startTime) : minStartTime
  });

  summary.startTime = minStartTime;
  if (summary.mainThreadTime === 0) summary.unusedPercentage = 100;
  return summary;
}

function dfs(adjList, thirdPartySet, url) {
  visited.set(url, 1);
  let result = [];
  if (thirdPartySet.has(url)) {
    result.push(url)
  }
  const children = adjList.get(url) || [];
  children.forEach(child => {
    if (!visited.get(child)) {
      let childResult = dfs(adjList, thirdPartySet, child);
      result = [...result, ...childResult];
    }
  })
  return result;
}

function getEntityName(thirdPartyData, url) {
  const entity = thirdPartyData.find(item => {
    let subItems = item.subItems || { items: [] };
    return subItems.items.some((subitem) => {
      if (subitem.url) {
        if (typeof subitem.url !== "string") return false;
        return subitem.url === url
      }
      return false;
    })
  }
  )

  return entity.entityName.name
}

function getDirectThirdParty(thirdPartyData, requestInitiators) {
  const directThirdParty = []
  const thirdPartySet = new Set();
  thirdPartyData.forEach(item => {
    item.subItems.items.forEach((subitem) => {
      if (typeof subitem.url !== "string") return;
      thirdPartySet.add(subitem.url);
    })
  }
  )
  const initiatorMap = new Map()
  requestInitiators.forEach(({ url, initiator }) => {
    initiatorMap.set(url, initiator)
  })

  thirdPartySet.forEach(script => {
    const initiator = initiatorMap.get(script)
    if (thirdPartySet.has(initiator)) return
    directThirdParty.push(script);
  })
  const adjList = createAdjList(requestInitiators);
  const entityMap = new Map()
  directThirdParty.forEach(script => {
    visited.clear();
    let result = dfs(adjList, thirdPartySet, script);
    let entityName = getEntityName(thirdPartyData, script)
    let entityScripts = entityMap.get(entityName) || [];
    entityScripts = [...entityScripts, ...result];
    entityMap.set(entityName, entityScripts);
  })
  return entityMap
}



function createAdjList(requestInitiators) {
  const adjList = new Map();
  requestInitiators.forEach((element) => {
    let children = adjList.get(element.initiator) || [];
    children = [...children, element.url];
    adjList.set(element.initiator, children);
  });
  return adjList;
}

export function getEntityMappings(requestInitiators, thirdPartyData,
  unminifiedJSData,
  renderBlockingResources,
  unusedJSData,
  fcp) {
  const entityMap = getDirectThirdParty(thirdPartyData, requestInitiators);
  const thirdPartyWithNetwork = getThirdPartyDataWithNetworkDetails(thirdPartyData, unminifiedJSData, renderBlockingResources, unusedJSData, fcp);
  const scriptDataMap = new Map()
  thirdPartyWithNetwork.forEach((element) => {
    element.subItems.items.forEach(subitem => {
      if (typeof subitem.url !== "string") return;
      scriptDataMap.set(subitem.url, subitem)
    })
  })
  const result = []
  entityMap.forEach((value, key) => {
    const obj = {
      entityName: {
        name: key
      },
      subItems: {
        items: []
      }
    }
    value.forEach(script => {
      const data = scriptDataMap.get(script) || {};
      obj.subItems.items.push(data)
    })
    let summary = getSummary(obj);
    let opportunities = getOpportunities(
      summary,
      obj.subItems.items.length,
      fcp
    );
    obj.subItems = {
      items: obj.subItems.items.length > 1
        ? [...obj.subItems.items, summary]
        : [...obj.subItems.items],
    }
    obj.opportunities = opportunities
    result.push(obj)
  });
  return result;
}

export function getThirdPartyDataWithNetworkDetails(
  thirdPartyData,
  unminifiedJSData,
  renderBlockingResources,
  unusedJSData,
  fcp
) {
  let thirdPartyWithNetwork = [];
  if (thirdPartyData.length > 0) {
    thirdPartyWithNetwork = thirdPartyData
      .reduce((acc, item) => {
        if (!item.entityName) return acc;
        let prevItem = acc.find(
          ({ entityName }) => item.entityName === entityName
        );
        let newItems = [];
        item.subItems.items.forEach((subitem) => {
          if (typeof subitem.url !== "string") return;

          if (
            unminifiedJSData.details.items.find(
              ({ url }) => url === subitem.url
            )
          ) {
            subitem.minified = "No";
          } else subitem.minified = "Yes";

          if (renderBlockingResources && renderBlockingResources.details) {
            let renderBlockingResource =
              renderBlockingResources.details.items.find(
                ({ url }) => url === subitem.url
              );
            if (renderBlockingResource) {
              subitem.renderBlocking = renderBlockingResource.wastedMs;
            } else subitem.renderBlocking = 0;
          }

          let js = unusedJSData.details.items.find(
            ({ url }) => url === subitem.url
          );
          if (js) {
            subitem.unusedPercentage = js.wastedPercent;
          } else {
            if (subitem.mainThreadTime) subitem.unusedPercentage = 0;
            else subitem.unusedPercentage = 100;
          }
          subitem.startTime = subitem.intervals.length
            ? subitem.intervals[0].startTime
            : "-";
          newItems.push(subitem);
        });

        if (prevItem) {
          if (prevItem.subItems.items.length > 1) prevItem.subItems.items.pop();
          newItems = [...prevItem.subItems.items, ...newItems];
          let summary = getSummary(newItems);
          let opportunities = getOpportunities(summary, newItems.length, fcp);
          if (newItems.length > 1) newItems.push(summary);
          prevItem.opportunities = opportunities;
          prevItem.subItems.items = newItems;
          return acc;
        }
        item.subItems.items = newItems;
        let summary = getSummary(item);
        let opportunities = getOpportunities(
          summary,
          item.subItems.items.length,
          fcp
        );

        return [
          ...acc,
          {
            ...item,
            subItems: {
              ...item.subItems,
              items:
                item.subItems.items.length > 1
                  ? [...item.subItems.items, summary]
                  : [...item.subItems.items],
            },
            opportunities,
          },
        ];
      }, [])
      .sort(
        (a, b) =>
          b.opportunities.user.length +
          b.opportunities.thirdParty.length -
          (a.opportunities.user.length + a.opportunities.thirdParty.length) ||
          b.opportunities.user.length - a.opportunities.user.length
      );
  }
  return thirdPartyWithNetwork;
}

export const headings = [
  { key: "url", text: "URL", itemType: "link" },
  { key: "mainThreadTime", text: "Main Thread Time", itemType: "ms" },
  { key: "blockingTime", text: "Main Thread Blocking Time", itemType: "ms" },
  { key: "transferSize", text: "Transfer Size", itemType: "bytes" },
  { key: "resourceSize", text: "Resource Size", itemType: "bytes" },
  { key: "minified", text: "Script Minified", itemType: "binary" },
  {
    key: "unusedPercentage",
    text: "Unused Percentage",
    itemType: "percentage",
  },
  {
    key: "startTime",
    text: "First Start Time",
    itemType: "ms",
  },
];
