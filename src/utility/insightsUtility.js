export function getOpportunities(
  {
    mainThreadTime,
    blockingTime,
    transferSize,
    resourceSize,
    minified,
    unusedPercentage,
  },
  numItems
) {
  const oppoutunities = {
    user: [],
    thirdParty: [],
  };
  if (mainThreadTime / numItems > 50 || blockingTime > 0) {
    oppoutunities.user.push(
      "Remove unnecessary scripts to optimise main thread time and blocking time"
    );
    oppoutunities.user.push(
      "Shift Scripts to web workers in order to improve to optimise main thread time and blocking time"
    );
    oppoutunities.thirdParty.push(
      "Optimise scripts to run faster to optimise main thread time and blocking time"
    );
    oppoutunities.thirdParty.push(
      "Deliver smaller JS payloads to reduce parsing and compilation time"
    );
  }
  if (blockingTime > 0) {
    oppoutunities.user.push(
      "Try to keep tasks short to optimise blocking time"
    );
    oppoutunities.thirdParty.push(
      "Try to keep tasks short and fast, if not possible break them into many smaller ones to optimise blocking time"
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
      "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity"
    );
    oppoutunities.thirdParty.push(
      "Divide large scripts in smaller chunks to reduce network bandwidth wastage for the unused part"
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
