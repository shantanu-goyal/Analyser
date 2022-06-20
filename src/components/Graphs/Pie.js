import { processChart } from '../../utility/graphUtility';
import React, { useEffect, useRef } from "react";
import "../../styles/DoughnutChart.css";
import { Chart, registerables } from 'chart.js';;



// Register the component with the chart.js library
Chart.register(...registerables);

/**
 * Function to generate pie graph from data
 * @param {Array} data Array of objects containing data for the chart
 * @param {titles} titles Chart Title 
 * @returns JSX for the chart
 */
function Pie({ data, title}) {

  let divRef=useRef();

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
  
  const id = makeid(100);
  useEffect(() => {
    // We get the initial configuration of the chart
    const cfg = processChart(data, title, 'pie');
    let div=divRef.current;
    div.innerHTML=`<canvas id=${id} />`

    //Render the chart
    const chart = new Chart(document.getElementById(id).getContext('2d'), cfg);

    // Cleanup function to remove the legend element and the chart
    return () => { 
      chart.destroy();
      div.innerHTML="";
    }
  }, [data, title, id]);


  return (
    <>
      <div className='final-graph'>
        <div ref={divRef}>
        </div>
      </div>
    </>)
}


export default Pie;