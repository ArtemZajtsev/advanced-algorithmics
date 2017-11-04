const fs = require('fs');

// let rawEdges = fs.readFileSync('./input/testEdge.txt', 'utf-8');
// let rawVertexes = fs.readFileSync('./input/testVertexes.txt', 'utf-8');
let rawEdges = fs.readFileSync('./input/edges.txt', 'utf-8');
let rawVertexes = fs.readFileSync('./input/vertexes.txt', 'utf-8');

class Vertex {
    constructor(name) {
        this.name = name;
        this.discover = 0;
        this.finish = 0;
        this.connected = [];
        this.visited = false;
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
        vertexArray.push(new Vertex(row.split(" ")[0]));
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
                if(connectedVertex.name === searchVertexName) break;
                if (!connectedVertex.visited) {
                    connectedVertex.discover = time;
                    bfs(connectedVertex);
                }
            }
        }
    };

    bfs(initialVertex);
    //console.log(discoveries);
    console.log(graph);
};


initBfs(createVertexes(rawEdges, rawVertexes), 'J');