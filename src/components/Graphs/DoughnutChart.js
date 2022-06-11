import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from "react";
import { processChart } from '../../utility/graphUtility'
import "../../styles/DoughnutChart.css"

// Register the component with the chart.js library
Chart.register(...registerables);


function DoughnutChart({ data, title }) {
  // Create a reference to the legend element
  const legendRef = useRef();

  useEffect(() => {
    // We get the initial configuration of the chart
    const cfg = processChart(data, title, 'doughnut');

    const canvas = document.getElementById('mychart' + title);

    // We store the current reference to the legend element 
    const legendDiv = legendRef.current;

    // We update the configuration of the chart and we render the legend of the chart seperately
    const config = {
      ...cfg,
      plugins: [
        {
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

    // We render the chart
    const chart = new Chart(canvas.getContext('2d'), config);

    // Cleanup function to remove the legend element and the chart
    return () => { chart.destroy(); legendDiv.innerHTML = ""; }
  }, [data, title]);


  return (
    <>
      <div className='final-graph'>
        <div className='doughnut'>
          <canvas id={"mychart" + title} />
        </div>
        <div className='legend-box'>
          <h1 style={{ textAlign: "center" }}>Legend</h1>
          <div ref={legendRef} className='custom-legend'></div>
        </div>
      </div>
    </>)
}

export default DoughnutChart;