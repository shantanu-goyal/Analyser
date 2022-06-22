import { Chart, registerables } from 'chart.js';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from "react";
import "../../styles/DoughnutChart.css";
import { processChart } from '../../utility/graphUtility';

// Register the component with the chart.js library
Chart.register(...registerables);

/**
 * Function to generate doughnut shaped graph from data
 * @param {Array} data Array of objects containing data for the chart
 * @param {titles} titles Chart Title 
 * @returns JSX for the chart
 */
function Graph({ data, title, type, hideLegend }) {
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

  // Create a reference to the legend element
  const legendRef = useRef();
  // Create a reference to the canvas element
  const canvasRef = useRef();
  const id = makeid(100);
  useEffect(() => {
    // We get the initial configuration of the chart
    const cfg = processChart(data, title, type === 'pie' ? 'pie' : 'doughnut');
    // Storing reference to the canvas element
    const canvas = canvasRef.current;
    // Storing reference to the legend element 
    const legendDiv = legendRef.current;

    // Updates the configuration of the chart and render the legend of the chart seperately
    const config = {
      ...cfg, // The previous configuration
      plugins: [
        {
          // Function to render the legend of the chart seperately
          beforeInit: function (chart) {
            const ul = document.createElement('ul');
            chart.data.labels.forEach((label, i) => {
              ul.innerHTML += `
                <li>
                  <span style="background-color: ${chart.data.datasets[0].backgroundColor[i]}">
                  </span>
                  ${label}
                </li>
              `;
            });
            return legendRef.current.appendChild(ul);
          }
        }
      ]
    }

    //Render the chart
    const chart = new Chart(canvas.getContext('2d'), config);

    // Cleanup function to remove the legend element and the chart
    return () => { 
      chart.destroy();
      legendDiv.innerHTML = ""; }
  }, [data, title,type]);


  return (
    <>
      <div className='final-graph'>
        <div className='doughnut'>
          <canvas ref={canvasRef} id={id} />
        </div>
        {!hideLegend && (
          <div className='legend-box'>
            <h1 style={{ textAlign: "center" }}>Legend</h1>
            <div ref={legendRef} className='custom-legend'></div>
          </div>
        )}
      </div>
    </>)
}

Graph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired
}
export default Graph;