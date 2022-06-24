import Bar from "../components/Graphs/Bar";
/**
 * Function extracts the total duration of network requests for each network request
 * @param {object} data 
 * @returns {object} - The data containing all network requests and total duration of network requests for each network request
 */
function extractDurationTime(data) {
    let durationTimeData = data.items.map(item => {
        // We return the data only if a network request has successfully finished
        if (item.finished) {
            return {
                url: item.url,
                // The duration is the difference between the startTime and the endTime
                data: item.endTime - item.startTime
            }
        }
        return {}
    }).filter(value => Object.keys(value).length !== 0);
    // Before returning the data, we filter out the empty objects
    return durationTimeData;
}



/**
 * Function to generate the graph for the total duration of different network requests 
 * @param {object} data - The data corresponding to the network requests
 * @returns {JSX} - The graph corresponding to data 
 */

function generateGraph(data) {
    const details = data.details;
    const durationTimeData = extractDurationTime(details);
    return <Bar data={{ result: durationTimeData, type: "ms" }} title={"Durartion of Network Requests"} />
}

export {generateGraph}