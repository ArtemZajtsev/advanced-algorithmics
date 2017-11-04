const fs = require('fs');
const dijkstra = require('./dijkstra.js');
const prims = require('./prims.js');

// let rawEdges = fs.readFileSync('./input/testEdge.txt', 'utf-8');
// let rawVertexes = fs.readFileSync('./input/testVertexes.txt', 'utf-8');
let rawEdges = fs.readFileSync('./input/edges.txt', 'utf-8');
let rawVertexes = fs.readFileSync('./input/vertexes.txt', 'utf-8');

class Vertex {
    constructor(name, x, y) {
        this.name = name;
        this.discover = 0;
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

// console.log(createVertexes(rawEdges,rawVertexes));

const initBfs = (graph, searchVertexName) => {
    let initialVertex = graph.find(x => x.name === 'A');
    let discoveries = [];
    let time = 0;

    const bfs = (vertex) => {
        if (vertex.name === searchVertexName) {
            discoveries.push(`Found!! ${vertex.name}`);
            vertex.finish = time;
            //console.log(vertex);
            return null;
        } else {
            time++;
            discoveries.push(vertex.name);
            vertex.visited = true;
            for (let i = 0; i < vertex.connected.length; i++) {
                let connectedVertex = graph.find(x => x.name === vertex.connected[i]);
                if (connectedVertex.name === searchVertexName) break;
                if (!connectedVertex.visited) {
                    connectedVertex.discover = time;
                    bfs(connectedVertex);
                }
            }
        }
    };

    bfs(initialVertex);
    return discoveries;
};


let bfsDiscoveries = initBfs(createVertexes(rawEdges, rawVertexes), 'J');
//console.log(bfsDiscoveries);

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

let primRes =prims.Prim(primsGraph, 'A');
//console.log(primRes);