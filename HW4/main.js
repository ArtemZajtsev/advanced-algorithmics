const fs = require('fs');
const kdTree = require('./kd-tree');

let data = fs.readFileSync('s2.txt', 'utf-8');
let points = [];
data.split(/\n/).forEach((row) => {
    let xy = row.split(',');
    points.push({x: parseInt(xy[0]), y: parseInt(xy[1])})
});

const distance = (a, b) => {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
};

let medianTree = new kdTree.kdTree(points, distance, ["x", "y"], false);
let randomTree = new kdTree.kdTree(points, distance, ["x", "y"], true);

let medianAccumulator = {};
let randomAccumulator = {};

const depthCalculator = (node, accumulator) => {
    accumulator[node.depth] = accumulator[node.depth] ? accumulator[node.depth] + 1 : 1;
    if (node.left) {
        depthCalculator(node.left, accumulator);
    }
    if (node.right) {
        depthCalculator(node.right, accumulator);
    }
};

depthCalculator(medianTree.root, medianAccumulator);
depthCalculator(randomTree.root, randomAccumulator);

console.log(medianAccumulator);
console.log(randomAccumulator);