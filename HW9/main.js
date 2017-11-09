const fs = require('fs');

let rawEdges = fs.readFileSync('./edges.txt', 'utf-8');
let rawVertexes = fs.readFileSync('./vertexes.txt', 'utf-8');

class Vertex {
    constructor(name) {
        this.name = name;
        this.connected = [];
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
        });
    });
    return vertexArray;
};

let vertexes = createVertexes(rawEdges, rawVertexes);
//console.log(vertexes);

const matrixParser = (vertexes) => {
    let dictionary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    let result = [];
    vertexes.forEach((vertex) => {
        let arr = new Array(dictionary.length).fill(0);
        vertex.connected.forEach((connectionName) => {
            arr[dictionary.indexOf(connectionName)] = 1;
        });
        result.push(arr);
    });
    return result;
};

let matrix = matrixParser(vertexes);

//console.log(matrixParser(vertexes));

const matrixMultiplication = (m1, m2) => {
    let result = [];
    for (let i = 0; i < m1.length; i++) {
        result[i] = [];
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < m1[0].length; k++) {
                //sum += m1[i][k] * m2[k][j];
                sum = (sum + m1[i][k] * m2[k][j]) > 0 ? 1 : 0;
            }
            result[i][j] = sum;
        }
    }
    return result
};

let numberMatrix = matrixMultiplication(matrixMultiplication(matrix, matrix), matrix);
//console.log(matrixMultiplication(matrixMultiplication(matrix,matrix), matrix));

const numberToLetterMatrix = (numberMatrix) => {
    let dictionary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    let result = [];
    for (let i = 0; i < numberMatrix.length; i++) {
        let letterRow = new Array(dictionary.length).fill('-');
        for (let j = 0; j < numberMatrix[i].length; j++) {
            if (numberMatrix[i][j]) {
                letterRow[j] = dictionary[j];
            }
        }
        letterRow.unshift(`For vertex ${dictionary[i]}`);
        result.push(letterRow);
    }
    return result;
};

//console.log(numberToLetterMatrix(numberMatrix));

const warshall = (matrix) => {
    let result = matrix;
    for(let i=0; i< result.length; i++) {
        for(let s=0; s<result.length;s++) {
            for(let t = 0; t<result.length; t++) {
                if(result[s][i] && result[i][t]) {
                    result[s][t] = 1;
                }
            }
        }
    }
    return result;
};

//console.log(warshall(matrix));


const doStuffUntilMatrixWillNotChange = (initialMatrix, approach) => {
    let notSameMatrix = true;
    let prevMatrix = initialMatrix;
    let iterations = 0;
    while (notSameMatrix) {
        let currentMatrix = [];
        if(approach === 'manyG') {
            currentMatrix = matrixMultiplication(prevMatrix,initialMatrix);
        } else if(approach === 'g2') {
            currentMatrix = matrixMultiplication(prevMatrix,prevMatrix);
        }
        else if(approach === 'warshall') {
            return warshall(matrix);
        }

        if(JSON.stringify(prevMatrix) === JSON.stringify(currentMatrix)) {
            notSameMatrix = false;
        }
        prevMatrix = currentMatrix;
        iterations++;
    }
    return prevMatrix;
};

let manyGApproach = doStuffUntilMatrixWillNotChange(matrix, 'manyG');
//console.log(numberToLetterMatrix(manyGApproach));
let g2 = doStuffUntilMatrixWillNotChange(matrix, 'g2');
//console.log(numberToLetterMatrix(g2));
let warshallResult = doStuffUntilMatrixWillNotChange(matrix, 'warshall');
//console.log(numberToLetterMatrix(warshallResult));


