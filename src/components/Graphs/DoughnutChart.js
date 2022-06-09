import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from "react";
import { processChart } from './utility'
import "../../styles/DoughnutChart.css"
Chart.register(...registerables);


function DoughnutChart({ data, title }) {
  const legendRef=useRef();
  useEffect(() => {
    const cfg = processChart(data, title, 'doughnut');
    const canvas = document.getElementById('mychart' + title);
    const legendDiv=legendRef.current;
    const config={
      ...cfg,
      plugins:[
        {
          beforeInit: function(chart){
            const ul = document.createElement('ul');
            chart.data.labels.forEach((label, i) => {
              ul.innerHTML += `
                <li>
                  <span style="background-color: ${ chart.data.datasets[0].backgroundColor[i] }">
                  </span>
                  ${ label }
                </li>
              `;
            });
            return legendRef.current.appendChild(ul);
          }
        }
      ]
    }
    const chart = new Chart(canvas.getContext('2d'), config);
    return () => {chart.destroy();legendDiv.innerHTML="";}
  }, [data, title]);
  return (
    <>
    <div className='final-graph'>
      <div className='doughnut'>
        <canvas id={"mychart" + title}/>
      </div>
      <div className='legend-box'>
        <h1 style={{textAlign:"center"}}>Legend</h1>
        <div ref={legendRef} className='custom-legend'></div>
      </div>
    </div>
     
      
    </>)
}

export default DoughnutChart;