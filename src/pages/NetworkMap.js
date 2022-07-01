import ForceGraph from "force-graph";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { NavBar } from "../components/NavBar";
import ThemeButton from "../components/ThemeButton";
import { DataContext } from "../contexts/DataContext";

function NetworkMap() {
  const dataContext = useContext(DataContext);
  let data = dataContext.data.data;
  const graphData = useRef(data["request-initiators"]);
  const [filteredData, setFilteredData] = useState(
    new Set(data["request-initiators"])
  );
  const hasFilteredSuccessorNode = new Map();
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

  // eslint-disable-next-line
  const optimizedFn = useCallback(debounce(handleChange), []);

  function handleChange(value) {
    if (value === "") {
      setFilteredData(new Set());
      return;
    }
    let newData = data["request-initiators"]
      .filter((element) => {
        return (
          element.url.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          element.initiator.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      })
      .map((element) => {
        return element.url.toLowerCase().indexOf(value.toLowerCase()) !== -1
          ? element.url
          : element.initiator;
      });
    setFilteredData(new Set(newData));
  }

  function dfs(url) {
    if (vis.get(url)) return hasFilteredSuccessorNode.get(url);
    vis.set(url, 1);
    let children = adjList.get(url) || [];
    let maxChildSize = 1;
    hasFilteredSuccessorNode.set(url, filteredData.has(url));
    children.forEach((child) => {
      let hasNodeAsSuccessor = dfs(child);
      maxChildSize = Math.max(maxChildSize, size.get(child));
      if (hasNodeAsSuccessor) hasFilteredSuccessorNode.set(url, 1);
    });
    size.set(url, maxChildSize + 3);
    return hasFilteredSuccessorNode.get(url);
  }

  function getSuccessorSizes(urlMap) {
    const entriesArray = Array.from(urlMap.keys());
    entriesArray.forEach((entry) => {
      if (!vis.get(entry)) {
        dfs(entry);
      }
    });
  }

  useEffect(() => {
    const urlMap = new Map();
    size.clear();
    vis.clear();
    adjList.clear();
    hasFilteredSuccessorNode.clear();
    graphData.current.forEach((element) => {
      urlMap.set(element.url, 1);
      urlMap.set(element.initiator, 1);
      let children = adjList.get(element.initiator) || [];
      children = [...children, element.url];
      adjList.set(element.initiator, children);
      size.set(element.url, 1);
      size.set(element.initiator, 1);
      vis.set(element.url, 0);
      vis.set(element.initiator, 0);
      hasFilteredSuccessorNode.set(element.url, 0);
      hasFilteredSuccessorNode.set(element.initiator, 0);
    });

    getSuccessorSizes(urlMap);

    const entriesArray = Array.from(urlMap.keys());
    const edges = graphData.current.map((element) => {
      return {
        source: element.initiator,
        target: element.url,
        linkColor:
          filteredData.size > 0 &&
          hasFilteredSuccessorNode.get(element.initiator) &&
          hasFilteredSuccessorNode.get(element.url)
            ? "red"
            : "steelblue",
      };
    });
    const nodes = entriesArray.map((entity) => {
      return {
        id: entity,
        name:
          entity.length > 100
            ? entity.substring(0, 50) + "..." + entity.slice(-50)
            : entity,
        val: size.get(entity),
      };
    });
    let config = {
      nodes,
      links: edges,
    };
    const Graph = ForceGraph()(
      document.getElementById("network-graph-container")
    )
      .graphData(config)
      .nodeAutoColorBy(({ id }) => new URL(id).hostname)
      .linkColor((link) => link.linkColor)
      .linkDirectionalArrowLength(10)
      .nodeLabel("name")
      .linkWidth((link) => link.linkColor==='red' ? 2 : 1)
      .onNodeDragEnd((node) => {
        node.fx = node.x;
        node.fy = node.y;
      })
      .onNodeClick((node) => {
        Graph.centerAt(node.x, node.y, 1000);
        Graph.zoom(8, 2000);
      });

    Graph.d3Force("center", null);
    Graph.d3Force('charge').strength(-100); 
    // eslint-disable-next-line
  }, [graphData.current, filteredData]);

  return (
    <>
      <NavBar />
      <div className="tog-container">
        <ThemeButton>Toggle Dark Mode</ThemeButton>
      </div>
      <div className="table-container">
        <input
          onChange={(e) => {
            optimizedFn(e.target.value);
          }}
          id="search-network-graph"
          placeholder="Search..."
        />
      </div>

      <div id="network-graph-container"></div>
    </>
  );
}

export default NetworkMap;
