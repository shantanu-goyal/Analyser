import ForceGraph from 'force-graph';
import { useContext, useEffect, useState, useCallback } from 'react';
import { NavBar } from '../components/NavBar';
import ThemeButton from '../components/ThemeButton';
import { DataContext } from '../contexts/DataContext';

function NetworkMap() {
    const dataContext = useContext(DataContext);
    let data = dataContext.data.data;
    data = data['request-initiators'];
    let [graphData, setGraphData] = useState(data);
    const size = new Map();
    const vis = new Map();
    const adjList = new Map();
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
        setGraphData(newData);
    }

    function dfs(url) {
        if (vis.get(url)) return
        vis.set(url, 1);
        let children = adjList.get(url)||[];
        let sz = size.get(url);
        children.forEach(child => {
            dfs(child);
            sz += size.get(child)
        });
        size.set(url, sz);
    }

    function getSuccessorSizes(urlMap) {
        const entriesArray = Array.from(urlMap.keys());
        entriesArray.forEach(entry => {
            if (!vis.get(entry)) {
                dfs(entry)
            }
        })
    }

    useEffect(() => {
        const urlMap = new Map();
        size.clear();
        vis.clear();
        adjList.clear();

        graphData.forEach(element => {
            urlMap.set(element.url, 1);
            urlMap.set(element.initiator, 1);
            let children = adjList.get(element.initiator) || [];
            children = [...children, element.url];
            adjList.set(element.initiator, children);
            size.set(element.url, 1);
            size.set(element.initiator, 1);
            vis.set(element.url, 0);
            vis.set(element.initiator, 0);
        });


        getSuccessorSizes(urlMap);

        const entriesArray = Array.from(urlMap.keys());
        const edges = graphData.map(element => {
            return {
                source: element.initiator,
                target: element.url
            }
        });
        const nodes = entriesArray.map(entity => {
            return {
                id: entity,
                name: entity.length>100?entity.slice(0,50)+"..."+entity.slice(-50):entity,
                val: size.get(entity)
            }
        })
        let config = {
            nodes,
            links: edges
        }
        const Graph = ForceGraph()(document.getElementById('network-graph-container')).graphData(config)
            .nodeRelSize(6)
            .nodeAutoColorBy(({id})=>new URL(id).hostname)
            .linkCurvature('curvature')
            .linkColor(() => 'steelblue')
            .linkDirectionalArrowLength(6)
            .nodeLabel('name')
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
        <div className='table-container'>
            <input onChange={(e) => {
                optimizedFn(e.target.value)
            }} id='search-network-graph' placeholder='Search...' />
        </div>


        <div id="network-graph-container">

        </div>

    </>
}

export default NetworkMap;