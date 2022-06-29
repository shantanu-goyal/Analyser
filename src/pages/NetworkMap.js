import { Chart, registerables } from 'chart.js';
import React, { useContext,useRef } from "react";
import { NavBar } from "../components/NavBar";
import ThemeButton from "../components/ThemeButton";
import Title from "../components/Title";
import { DataContext } from "../contexts/DataContext";
import { ForceDirectedGraphController } from 'chartjs-chart-graph'

Chart.register(ForceDirectedGraphController);
Chart.register(...registerables);



function NetworkMap() {
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
    let dataContext = useContext(DataContext);
    let data = dataContext.data.data;
    data = data['request-initiators'];
    const divRef = useRef();

    function helper(){
        if(!divRef ||!divRef.current){
            return;
        }
        let div = divRef.current;
        div.innerHTML = `<canvas id=${id} />`;
        const urlMap = new Map();
        data.forEach(element => {
            urlMap.set(element.url, 1);
            urlMap.set(element.initiator, 1);
        });
        const entriesArray = Array.from(urlMap.keys());
        const nodes = entriesArray.map(entity => {
            return {
                id: entity,
                group: entity
            }
        })
        const edges = data.map(element => {
            return {
                source: element.initiator,
                target: element.url
            }
        });

        const config = {
            type: ForceDirectedGraphController.id,
            data: {
                labels: nodes.map((d) => d.id),
                datasets: [{
                    pointBackgroundColor: 'steelblue',
                    pointRadius: 5,
                    data: nodes,
                    edges: edges
                }]
            },
            options:{
                plugins:{
                    legend:{
                        display:false
                    }
                }
            }
        }
        const canvas = document.getElementById(id);
        if (canvas) {
            new Chart(document.getElementById(id).getContext('2d'), config);
        }
    }

    setTimeout(()=>{
        helper();
    },1000)


    return <>
        <NavBar />
        <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
        </div>
        <Title heading={"Network Map"} />
        <div ref={divRef}>
        </div>
    </>
}

export default NetworkMap;