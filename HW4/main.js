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

let tree = new kdTree.kdTree(points, distance, ["x", "y"]);

let accumulator = {};

const depthCalculator = (node) => {
    accumulator[node.depth] = accumulator[node.depth] ? accumulator[node.depth]+1 : 1;
    //console.log(accumulator);
    if (node.left) {
        depthCalculator(node.left);
    }
    if (node.right) {
        depthCalculator(node.right);
    }
};

depthCalculator(tree.root);

console.log(accumulator);