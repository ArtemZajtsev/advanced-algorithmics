const fs = require('fs');

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

console.log(numberToLetterMatrix(randomWalkMatrices(originalMatrix, 100)));
//randomWalkMatrices(originalMatrix, 100);
