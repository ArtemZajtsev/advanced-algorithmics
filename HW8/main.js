const fs = require('fs');
const dijkstra = require('./dijkstra.js');
const prims = require('./prims.js');
const scc = require('./scc.js');

// let rawEdges = fs.readFileSync('./input/testEdge.txt', 'utf-8');
// let rawVertexes = fs.readFileSync('./input/testVertexes.txt', 'utf-8');
let rawEdges = fs.readFileSync('./input/edges.txt', 'utf-8');
let rawVertexes = fs.readFileSync('./input/vertexes.txt', 'utf-8');

class Vertex {
    constructor(name, x, y) {
        this.name = name;
        this.discover = -1;
        this.finish = 0;
        this.connected = [];
        this.visited = false;
        this.x = x;
        this.y = y;
    }
}

const uniqueArray = (arr) => {
    return arr.filter((item, pos) => {
        return arr.indexOf(item) === pos;
    });
};

const createVertexes = (rawEdges, rawVertexes) => {
    let vertexArray = [];
    rawVertexes.split(/\n/).forEach((row) => {
        let split = row.split(" ");
        vertexArray.push(new Vertex(split[0], parseInt(split[1]), parseInt(split[2])));
    });
    rawEdges.split(/\n/).forEach((row) => {
        let split = row.split(' ');
        vertexArray.forEach((vertex) => {
            if (vertex.name === split[0]) {
                vertex.connected.push(split[1]);
            }
            if (vertex.name === split[1]) {
                vertex.connected.push(split[0]);
            }
            vertex.connected = uniqueArray(vertex.connected);
        });
    });
    return vertexArray;
};

const initDfs = (graph) => {
    let initialVertex = graph.find(x => x.name === 'A');
    let discoveries = [];
    let time = 0;

    const dfs = (vertex) => {
        time++;
        vertex.discover = time;
        vertex.visited = true;
        discoveries.push(vertex.name);
        for (let i = 0; i < vertex.connected.length; i++) {
            let connectedVertex = graph.find(x => x.name === vertex.connected[i]);
            if (!connectedVertex.visited) {
                dfs(connectedVertex);
            }
        }
        vertex.finish = time;
    };

    dfs(initialVertex);
    return discoveries;
};


let dfsDiscoveries = initDfs(createVertexes(rawEdges, rawVertexes));
//console.log(dfsDiscoveries);

let dijkstraGraph = new dijkstra.Graph();

const dijkstraParser = (vertexes) => {

    const distanceCalculator = (initialVertex, namesArr) => {
        let result = {};
        namesArr.forEach((name) => {
            let currentVertex = vertexes.find(x => x.name === name);
            result[name] = Math.sqrt(Math.pow(initialVertex.x - currentVertex.x, 2) + Math.pow(initialVertex.y - currentVertex.y, 2));
        });
        return result;
    };

    vertexes.forEach((vertex) => {
        dijkstraGraph.addVertex(vertex.name, distanceCalculator(vertex, vertex.connected));
    });
};

const allShortestDistsFrom = (from) => {
    let vertexes = createVertexes(rawEdges, rawVertexes);
    let result = {};

    dijkstraParser(vertexes);
    vertexes.forEach((vertex) => {
        result[`A -> ${vertex.name}`] = dijkstraGraph.shortestPath(from, vertex.name).concat([from]).reverse();
    });

    return result;
};

let dijkstraResult = allShortestDistsFrom('A');
//console.log(dijkstraResult);

let primsGraph = new prims.Graph();

const primsParser = (vertexes, edges) => {
    //console.log(edges);
    vertexes.forEach((vertex) => {
        primsGraph.addNode(vertex.name);
    });
    edges.split(/\n/).forEach((row) => {
        let split = row.split(' ');
        primsGraph.addEdge(split[0], split[1], split[3]);
    })
};

primsParser(createVertexes(rawEdges, rawVertexes), rawEdges);

let primRes = prims.Prim(primsGraph, 'A');
//console.log(primRes);


let directedRawEdges = fs.readFileSync('./input/edgesDirected.txt', 'utf-8');
let directedRawVertexes = fs.readFileSync('./input/vertexesDirected.txt', 'utf-8');

const createDirectedVertexes = (rawEdges, rawVertexes) => {
    let vertexArray = [];
    rawVertexes.split(/\n/).forEach((row) => {
        let split = row.split(" ");
        vertexArray.push(new Vertex(split[0], parseInt(split[1]), parseInt(split[2])));
    });
    rawEdges.split(/\n/).forEach((row) => {
        let split = row.split(' ');
        vertexArray.forEach((vertex) => {
            if (vertex.name === split[0]) {
                vertex.connected.push(split[1]);
            }
            vertex.connected = uniqueArray(vertex.connected);
        });
    });
    return vertexArray;
};

//console.log(createDirectedVertexes(directedRawEdges, directedRawVertexes));

const sccParser = (vertexes) => {
    let dictionary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    let adjList = [];
    vertexes.forEach((vertex) => {
        let edges = [];
        vertex.connected.forEach((connection) => {
           edges.push(dictionary.indexOf(connection));
        });
        adjList.push(edges);
    });
    return adjList;
};

console.log(sccParser(createDirectedVertexes(directedRawEdges, directedRawVertexes)));

