const fs = require('fs');

const stream = fs.createWriteStream('logs.txt', {flags: 'a'});

let rawEdges = fs.readFileSync('./edges.txt', 'utf-8');
let rawVertexes = fs.readFileSync('./vertexes.txt', 'utf-8');

const dictionary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

class Vertex {
    constructor(name) {
        this.name = name;
        this.connected = [];
        this.count = 0;
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
        vertexArray.push(new Vertex(split[0]));
    });
    rawEdges.split(/\n/).forEach((row) => {
        let split = row.split(' ');
        vertexArray.forEach((vertex) => {
            if (vertex.name === split[0]) {
                vertex.connected.push(split[1]);
            }
            vertex.connected = uniqueArray(vertex.connected);
            vertex.connected.sort();
        });
    });
    return vertexArray;
};

let originalVertexes = createVertexes(rawEdges, rawVertexes);

const matrixParser = (vertexes) => {

    let result = [];
    let probability;
    vertexes.forEach((vertex) => {
        let arr = new Array(dictionary.length).fill(0);
        if (vertex.connected.length === 3) {
            probability = [0.6, 0.3, 0.1];
        } else if (vertex.connected.length === 2) {
            probability = [0.8, 0.2];
        } else {
            probability = [1];
        }
        for (let i = 0; i < vertex.connected.length; i++) {
            arr[dictionary.indexOf(vertex.connected[i])] = probability[i];
        }


        result.push(arr);
    });
    return result;
};

let originalMatrix = matrixParser(originalVertexes);

const matrixMultiplication = (m1, m2) => {
    let result = [];
    for (let i = 0; i < m1.length; i++) {
        result[i] = [];
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result
};

const numberToLetterMatrix = (numberMatrix) => {
    let result = [];
    for (let i = 0; i < numberMatrix.length; i++) {
        let letterRow = new Array(dictionary.length).fill(0);
        for (let j = 0; j < numberMatrix[i].length; j++) {
            if (numberMatrix[i][j]) {
                letterRow[j] = numberMatrix[i][j];
            }
        }
        letterRow.unshift(`For vertex ${dictionary[i]}`);
        result.push(letterRow);
    }

    return result;
};


const randomWalkMatrices = (matrix, n) => {
    let multipliedMatrix;
    let tmp = matrix;
    for (let i = 0; i < n; i++) {
        multipliedMatrix = matrixMultiplication(tmp, matrix);
        tmp = multipliedMatrix;
    }
    return multipliedMatrix;
};

//console.log(numberToLetterMatrix(randomWalkMatrices(originalMatrix, 100)));
//randomWalkMatrices(originalMatrix, 100);

const startNodeCoords = [80, 920];
const endNodeCoords = [800, 80];

const euclideanDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.gCost = 0;
        this.hCost = euclideanDistance(this.x, this.y, endNodeCoords[0], endNodeCoords[1]);
        this.fCost = this.gCost + this.hCost;
        this.stepDistanceMultiplier = 1;
        this.closed = false;
        this.open = false;
        this.parent = 0;
        this.blocked = false;
    }

    setRegion(startNode) {
        if (this.x >= 150 && this.x <= 350 && this.y >= 600 && this.y <= 800) {
            this.hCost = Infinity;
            this.blocked = true;
        }
        if (euclideanDistance(this.x, this.y, 550, 720) <= 150) {
            this.hCost = Infinity;
            this.blocked = true;
        }
        if (euclideanDistance(this.x, this.y, 600, 350) <= 200) {
            this.stepDistanceMultiplier = 2;
        }
        if (euclideanDistance(this.x, this.y, 250, 450) <= 70) {
            this.stepDistanceMultiplier = 4;
        }
        if (euclideanDistance(this.x, this.y, 150, 350) <= 80) {
            this.stepDistanceMultiplier = 4;
        }
        if ((startNode.y - 0.25 * startNode.x + 87.5 >= 0 && this.y - 0.25 * this.x + 87.5 <= 0 || startNode.y - 0.25 * startNode.x + 87.5 <= 0 && this.y - 0.25 * this.x + 87.5 >= 0 )
            && this.x >= 550 && this.x <= 950 && this.y >= 50 && this.y <= 150) {
            this.hCost = Infinity;
            this.blocked = true;
        }
    }

}

let startNode = new Node(startNodeCoords[0], startNodeCoords[1]);
let endNode = new Node(endNodeCoords[0], endNodeCoords[1]);

const getDestinations = (node) => {
    let destinations = [];
    let xStepArr = [0, 2, 2, 2, 0, -2, -2, -2];
    let yStepArr = [2, 2, 0, -2, -2, -2, 0, 2];

    for (let i = 0; i < 8; i++) {
        if (node.x + xStepArr[i] >= 0 && node.y + yStepArr[i] >= 0 && node.x + xStepArr[i] <= 1000 && node.y + yStepArr[i] <= 1000) {
            destinations.push(new Node(node.x + xStepArr[i], node.y + yStepArr[i]));
        }
    }

    destinations.forEach((destination) => {
        destination.setRegion(node);
        destination.gCost = node.gCost + euclideanDistance(node.x, node.y, destination.x, destination.y) * destination.stepDistanceMultiplier;
    });

    return destinations;
};

//console.log(getDestinations(startNode));

const aStar = (startNode) => {

    const getPath = (currentNode) => {
        if (currentNode.parent) {
            stream.write(`fcircle ${currentNode.x},${currentNode.y} 1 red\n`);
            getPath(currentNode.parent)
        }
    };

    let open = [];
    let closedHash = {};
    let found = false;
    startNode.open = true;
    startNode.closed = false;
    open.push(startNode);
    let count = 0;

    while (!found) {
        open.sort((x, y) => x.fCost - y.fCost);

        if (open.length > 1000) {
            open.length = 1000;
        }

        const current = open.shift();
        current.closed = true;
        current.open = false;
        closedHash[`${current.x}:${current.y}`] = current;

        stream.write(`fcircle ${current.x},${current.y} 1 black\n`);

        count++;
        if (count  % 1000 === 0) {
            console.log(count);
        }

        //return condition
        if (euclideanDistance(current.x, current.y, endNode.x, endNode.y) <= 10) {
            console.log(current.fCost);
            found = true;
            getPath(current);
            stream.end();
            return;
        }

        getDestinations(current).forEach((neighbour) => {
            if (closedHash[`${neighbour.x}:${neighbour.y}`] || neighbour.blocked) {
                return;
            }

            let oldVersionInOpen = open.find((x) => x.x === neighbour.x && x.y === neighbour.y);

            if (oldVersionInOpen) {
                neighbour.open = true;
            }

            if (!neighbour.open || (neighbour.gCost < oldVersionInOpen.gCost)) {
                neighbour.fCost = neighbour.gCost + neighbour.hCost;
                neighbour.parent = current;

                if (!neighbour.open) {
                    neighbour.open = true;
                    open.push(neighbour);
                } else {
                    oldVersionInOpen.fCost = neighbour.gCost + oldVersionInOpen.hCost;
                    oldVersionInOpen.parent = current;
                }
            }
        });
    }
};

aStar(startNode);

