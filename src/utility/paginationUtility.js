/**
 *
 * @returns Array of page numbers
 */
function getPageNumbers(active, LENGTH) {
  const arr = [];
  let numberBehind = Math.min(2, active - 1);
  let numberAhead = Math.min(LENGTH - active, 2);
  if (numberBehind < 2) {
    numberAhead = Math.min(LENGTH - active, 4 - numberBehind);
  } else if (numberAhead < 2) {
    numberBehind = Math.min(active - 1, 4 - numberAhead);
  }
  for (
    let i = Math.max(active - numberBehind, 1);
    i <= Math.min(active + numberAhead, LENGTH);
    i++
  ) {
    arr.push(i);
  }
  return arr;
}

export { getPageNumbers };
