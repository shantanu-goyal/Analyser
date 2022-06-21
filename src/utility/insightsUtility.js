export function getOpportunities(
  {
    mainThreadTime,
    blockingTime,
    transferSize,
    resourceSize,
    minified,
    unusedPercentage,
    renderBlocking,
  },
  numItems
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
      opp += ` and to remove main-thread blocking time of ${Math.round(blockingTime * 100) / 100} ms`;
    opportunities.user.push(opp);
  }
  if (blockingTime > 0) {
    if (mainThreadTime / numItems <= 50) {
      opportunities.user.push(
        `Move scripts to web workers to remove main-thread blocking time of ${Math.round(blockingTime * 100) / 100} ms`
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
  if (minified === "No") {
    let opp = "Minify";
    if (resourceSize / transferSize < 2) {
      opp += ` and compress`;
    }
    opp += " scripts to reduce parsing and network time";
    opportunities.thirdParty.push(opp);
  }
  if (renderBlocking) {
    opportunities.user.push(
      `Use async and defer for non-critical scripts to reduce render Blocking time`
    );
  }
  return opportunities;
}
