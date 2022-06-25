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
    let opp = `Move scripts to web workers to save ${
      Math.round(mainThreadTime * 100) / 100
    } ms of main thread time`;
    if (blockingTime > 0)
      opp += ` and to remove main-thread blocking time of ${
        Math.round(blockingTime * 100) / 100
      } ms`;
    opportunities.user.push(opp);
  }
  if (blockingTime > 0) {
    if (mainThreadTime / numItems <= 50) {
      opportunities.user.push(
        `Move scripts to web workers to remove main-thread blocking time of ${
          Math.round(blockingTime * 100) / 100
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
  });
  summary.startTime = item.intervals.length ? item.intervals[0].startTime : "-";
  if (summary.mainThreadTime === 0) summary.unusedPercentage = 100;
  return summary;
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

          if (renderBlockingResources) {
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
