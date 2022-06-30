import ForceGraph from 'force-graph';
import { useContext, useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import ThemeButton from '../components/ThemeButton';
import Title from '../components/Title';
import { DataContext } from '../contexts/DataContext';

function NetworkMap() {
    const dataContext = useContext(DataContext);
    let data = dataContext.data.data;
    data = data['request-initiators'];
    useEffect(() => {
        const urlMap = new Map();
        data.forEach(element => {
            urlMap.set(element.url, 1);
            urlMap.set(element.initiator, 1);
        });
        const entriesArray = Array.from(urlMap.keys());
        const nodes = entriesArray.map(entity => {
            return {
                id: entity,
                name: entity
            }
        })
        const edges = data.map(element => {
            return {
                source: element.initiator,
                target: element.url
            }
        });
        let config = {
            nodes,
            links: edges
        }
        const Graph = ForceGraph()(document.getElementById('network-graph-container')).graphData(config)
            .nodeRelSize(6)
            .nodeAutoColorBy('name')
            .linkColor(() => 'steelblue')
            .linkDirectionalParticles(1)
            .nodeLabel('id')
            .onNodeDragEnd(node => {
                node.fx = node.x;
                node.fy = node.y;
            }).onNodeClick(node => {
                Graph.centerAt(node.x, node.y, 1000);
                Graph.zoom(8, 2000);
            }).d3VelocityDecay(0.3);


        Graph.d3Force('center', null);


    })
    return <>
        <NavBar />
        <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
        </div>
        <Title heading={"Network Map"}></Title>
        <div id="network-graph-container">

        </div>

    </>
}

export default NetworkMap;