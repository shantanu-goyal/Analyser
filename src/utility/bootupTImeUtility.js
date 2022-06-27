import Bar from "../components/Graphs/Bar";
/**
* Function to extract the total CPU time corresponding to each url from the data 
* @param {object} data
* @returns {object} - The data containing all urls and total
* CPU time corresponding to each url
*/
function extractTotalTime(data) {
    let totalTimeData = data.items.map(item => {
        return {
            url: item.url,
            data: item.total
        }
    }).filter(item=>{
        return item.url!=="Unattributable";
    })
    return totalTimeData;
}

/**
 * Function to extract the total script evaluation time corresponding to each url from the data 
 * @param {object} data
 * @returns {object} - The data containing all urls and total script evaluation time corresponding to each url
 */
function extractScriptEvaluationTime(data) {
    let scriptEvaluationTimeData = data.items.map(item => {
        return {
            url: item.url,
            data: item.scripting
        }
    }).filter(item=>{
        return item.url!=="Unattributable";
    })
    return scriptEvaluationTimeData;
}

/**
 * Function to extract the total script parsing time corresponding to each url from the data 
 * @param {object} data
 * @returns {object} - The data containing all urls and total scirpt parsing time corresponding to each url
 */
function extractScriptParsingTime(data) {
    let scriptParsingTimeData = data.items.map(item => {
        return {
            url: item.url,
            data: item.scriptParseCompile
        }
    }).filter(item=>{
        return item.url!=="Unattributable";
    })
    return scriptParsingTimeData;
}

/**
 * Function to generate the graph for the bootup time
 * 
 * @param {object} data - The data corresponding to the bootup time
 * @param {string} value - The type of the graph to be generated
 * @returns {JSX} - The graph corresponding to the type of the graph requested by the user
 */

function generateGraph(data, value) {
    // Extracting the details from the data
    const details = data.details;
    const total = extractTotalTime(details);
    const evaluation = extractScriptEvaluationTime(details);
    const parsing = extractScriptParsingTime(details);
    // User requests the total CPU time graph
    if (value === "total") {
        data = { result: total, type: "ms" };
        return <Bar title={"Total CPU Time"} data={data}></Bar>
    }
    // User requests the script parsing time graph
    else if (value === "script-parsing") {
        data = { result: parsing, type: "ms" };
        return <Bar title={"Script Parsing Time"} data={data}></Bar>
    }
    // User requests the script evaluation time graph
    else {
        data = { result: evaluation, type: "ms" };
        return <Bar title={"Script Evaluation Time"} data={data} />
    }
}

export { generateGraph }