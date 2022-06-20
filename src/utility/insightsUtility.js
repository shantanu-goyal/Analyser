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
  const oppoutunities = {
    user: [],
    thirdParty: [],
  };
  if (mainThreadTime / numItems > 50 || blockingTime > 0) {
    oppoutunities.user.push(
      "Optimize main thread time and blocking time by removing unnecessary scripts"
    );
    oppoutunities.user.push(
      `Move scripts to web workers in order to save ${
        Math.round((mainThreadTime + blockingTime) * 100) / 100
      } ms of main thread time and blocking time`
    );
    oppoutunities.thirdParty.push(
      "Optimize scripts to run faster to reduce main thread and blocking time"
    );
    oppoutunities.thirdParty.push(
      "Smaller JS payloads reduce compilation and parsing time"
    );
  }
  if (blockingTime > 0) {
    oppoutunities.user.push(
      `Keep tasks short to save ${Math.round(blockingTime * 100) / 100} ms of main thread blocking time`
    );
    oppoutunities.thirdParty.push(
      "If possible, break large tasks into smaller ones to make blocking time as short as possible"
    );
  }
  if (transferSize / numItems > 50 * 1024) {
    if (mainThreadTime / numItems <= 50) {
      oppoutunities.user.push(
        "Remove unnecessary scripts to reduce tansfer of data over network"
      );
    }
    if (resourceSize / transferSize < 3) {
      oppoutunities.thirdParty.push(
        "Try to compress resources properly before transfering over the network"
      );
    }
  }
  if (minified === "No") {
    oppoutunities.thirdParty.push(
      "Minify Scripts to reduce payload sizes and script parse time."
    );
    oppoutunities.user.push(
      "Use minified scripts to reduce payload sizes and script parse time."
    );
  }
  if (unusedPercentage > 0) {
    oppoutunities.user.push(
      `Defer loading scripts until they are required to decrease ${Math.round((unusedPercentage * transferSize) /1024) / 100} KiB consumed by network activity`
    );
    console.log(unusedPercentage, transferSize)
    oppoutunities.thirdParty.push(
      "Split large scripts into smaller chunks to reduce unused network bandwidth"
    );
  }
  if (renderBlocking) {
    oppoutunities.user.push(
      `Use async and defer for non-critical parts and scripts to save ${Math.round(renderBlocking * 100) / 100} ms of render Blocking time`
    );
  }
  if (oppoutunities.thirdParty.length === 0) {
    oppoutunities.thirdParty.push("Things are Pretty Optimised! Good Job!");
  }
  if (oppoutunities.user.length === 0) {
    oppoutunities.user.push("Things are Pretty Optimised! Good Job!");
  }
  return oppoutunities;
}
