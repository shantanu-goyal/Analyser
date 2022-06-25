import Graph from "../components/Graphs/Graph";

/**
 * Function extracts the transfer size for each group label.
 * @param {object} data 
 * @returns {object} - The data containing the transfer size for each group label.
 */
function extractTransferSize(data) {
    let transferSizeData = data.items.map(item => {
        return {
            url: item.label,
            data: item.transferSize / 1024
        }
    })
    return transferSizeData.slice(1);
}

/**
 * 
 * @param {object} data - The data corresponding to the transfer size.
 * @returns {JSX} - The graph corresponding to data.
 */
function generateGraph(data) {
    const details = data.details;
    const transferSizeData = extractTransferSize(details);
    return (<Graph data={transferSizeData} title={"Resource Summary"} />)
}

export {generateGraph}