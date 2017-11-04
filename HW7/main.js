const fs = require('fs');

//let rawData1 = fs.readFileSync('email-Eu-core.txt', 'utf-8');
//let rawData2 = fs.readFileSync('soc-sign-bitcoinalpha.csv', 'utf-8');
//let rawData3 = fs.readFileSync('email-Eu-core-temporal.txt', 'utf-8');
let rawData4 = fs.readFileSync('oregon1_010331.txt', 'utf-8');


const distOfNodeDegreesCounter = (rawData,path) => {
    let nodeDegrees = [];
    let amountOfNodesForLength = [];
    let result = [];
    rawData.split(/\n/).forEach((row) => {
        let from = row.split(' ')[0];
        nodeDegrees[from] = nodeDegrees[from] ? nodeDegrees[from] + 1 : 1;
    });
    nodeDegrees.map((degreeAmount) => {
        amountOfNodesForLength[degreeAmount] = amountOfNodesForLength[degreeAmount] ? amountOfNodesForLength[degreeAmount] + 1 : 1;
    });
    for(let i=0; i<amountOfNodesForLength.length;i++){
        if(amountOfNodesForLength[i]) {
            result.push({nodeDegree: i, amountOfNodes: amountOfNodesForLength[i]})
        }
    }
    fs.writeFile(path,
        JSON.stringify(result),
        (err) => { err ? console.log(err) : ''})
};

//distOfNodeDegreesCounter(rawData1,'./task4/Distribution of node degrees for email-Eu-core.txt');
//distOfNodeDegreesCounter(rawData2,'./task4/Distribution of node degrees for soc-sign-bitcoinalpha.csv');
//distOfNodeDegreesCounter(rawData3,'./task4/Distribution of node degrees email-Eu-core-temporal.txt');
distOfNodeDegreesCounter(rawData4,'./task4/Distribution of node degrees for oregon1_010331.txt');
