function isArrayEmpty(array) {
  return array.length === 0;
}

function shouldLazyload({ subItems }, loadTime) {
  let minStartTime = 100000000;
  subItems.items.forEach((subitem) => {
    if (!subitem.intervals) return;
    minStartTime =
      subitem.intervals.length > 0
        ? Math.min(minStartTime, subitem.intervals[0].startTime)
        : minStartTime;
  });
  return (
    subItems.items.some(({ unusedPercentage }) => unusedPercentage === 100) ||
    minStartTime <= loadTime
  );
}

function isOld({ subItems }) {
  if (isArrayEmpty(subItems.items)) return false;
  return (
    subItems.items.at(-1).resourceSize / subItems.items.at(-1).transferSize <=
      2 ||
    subItems.items.at(-1).minified === "No" ||
    subItems.items.at(-1).unusedPercentage >= 50 ||
    subItems.items.at(-1).blockingTime > 250 ||
    subItems.items.at(-1).blockingTime / subItems.items.length > 50
  );
}

function isHeavy({ subItems }) {
  if (isArrayEmpty(subItems.items)) return false;
  return (
    subItems.items.at(-1).blockingTime > 0 ||
    subItems.items.at(-1).mainThreadTime > 250 ||
    subItems.items.at(-1).mainThreadTime / subItems.items.length > 50
  );
}

function isRenderBlocking({ subItems }) {
  if (isArrayEmpty(subItems.items)) return false;
  return subItems.items.at(-1).renderBlocking > 0;
}

export { shouldLazyload, isHeavy, isOld, isRenderBlocking };
