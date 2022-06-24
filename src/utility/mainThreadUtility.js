import Graph from "../components/Graphs/Graph";

/**
  * Function extracts the main thread work breakdown time for each group label 
  * @param {object} data 
  * @returns {object} - The data containing all group labels and main thread work breakdown time for each group label
  */
function extractTotalTime(data) {
    let totalTimeData = data.items.map(item => {
        return {
            url: item.groupLabel,
            data: item.duration
        }
    })
    return totalTimeData;
}

/**
 * Function to generate the graph for the main thread work breakdown time
 * 
 * @param {object} data - The data corresponding to the main thread work breakdown time
 * @returns {JSX} - The graph corresponding to data 
 */

function generateGraph(data) {
    const details = data.details;
    const durationData = extractTotalTime(details);
    return <Graph data={durationData} title={"Main Thread Work Breakdown"} />
}

export {generateGraph}