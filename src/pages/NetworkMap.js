import ForceGraph from 'force-graph';
import { useContext, useEffect, useState, useCallback } from 'react';
import { NavBar } from '../components/NavBar';
import ThemeButton from '../components/ThemeButton';
import Title from '../components/Title';
import { DataContext } from '../contexts/DataContext';

function NetworkMap() {
    const dataContext = useContext(DataContext);
    let data = dataContext.data.data;
    data = data['request-initiators'];
    let [graphData, setGraphData] = useState(data);

    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args);
            }, 500);
        };
    };

    const optimizedFn = useCallback(debounce(handleChange), []);



    function handleChange(value) {
        let newData = data.filter(element => {
            return (
                (element.url.toLowerCase().indexOf(value.toLowerCase()) !== -1) || (element.initiator.toLowerCase().indexOf(value.toLowerCase()) !== -1)
            )
        })
        console.log(newData);
        setGraphData(newData);
    }

    useEffect(() => {
        const urlMap = new Map();
        graphData.forEach(element => {
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
        const edges = graphData.map(element => {
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
            .linkCurvature('curvature')
            .linkColor(() => 'steelblue')
            .linkDirectionalArrowLength(6)
            .nodeLabel('id')
            .onNodeDragEnd(node => {
                node.fx = node.x;
                node.fy = node.y;
            }).onNodeClick(node => {
                Graph.centerAt(node.x, node.y, 1000);
                Graph.zoom(8, 2000);
            });


        Graph.d3Force('center', null);

    }, [graphData]);
    return <>
        <NavBar />
        <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
        </div>
        <Title heading={"Network Map"}></Title>
        <div className='table-container'>
            <label htmlFor='search-network-graph'> Search:{" "}
                <input onChange={(e)=>{
                    optimizedFn(e.target.value)
                }} id='search-network-graph' />
            </label>
        </div>


        <div id="network-graph-container">

        </div>

    </>
}

export default NetworkMap;