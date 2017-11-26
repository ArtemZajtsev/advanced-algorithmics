const fs = require('fs');

let twenty = fs.readFileSync('./2017/TSP_20.txt', 'utf-8');
let hundred = fs.readFileSync('./2017/TSP_100.txt', 'utf-8');
let thousand = fs.readFileSync('./2017/TSP_1000.txt', 'utf-8');

class City {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.closestCity = null;
        this.closestDistance = 0;
    }
}

const createCities = (raw) => {
    let vertexArray = [];
    raw.split(/\n/).forEach((row) => {
        let split = row.split(" ");
        vertexArray.push(new City(parseInt(split[0]), parseInt(split[1])));
    });
    return vertexArray;
};

const euclideanDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const getDistances = (citiesArr, initialCity) => {
    let distances = [];
    citiesArr.forEach((city, index) => {
        if (city.x === initialCity.x && city.y === initialCity.y) {
            citiesArr.splice(index, 1);
            return;
        }

        distances.push({
            x: city.x,
            y: city.y,
            distance: euclideanDistance(city.x, city.y, initialCity.x, initialCity.y)
        });
    });

    distances.sort((x, y) => x.distance - y.distance);
    initialCity.closestCity = distances[0] ? new City(distances[0].x, distances[0].y) : null;
    initialCity.closestDistance = distances[0] ? distances[0].distance : 0;
    return initialCity;
};

let twentyCities = createCities(twenty);
let hundredCities = createCities(hundred);
let thousandCities = createCities(thousand);


let path = [];

const buildRoute = (cities, currentCity, acc) => {
    let currentWithClosest = getDistances(cities, currentCity);
    if (currentWithClosest.closestCity) {
        acc += currentWithClosest.closestDistance;
        path.push(currentCity);
        stream.write(`line ${currentCity.x},${currentCity.y} ${currentWithClosest.closestCity.x},${currentWithClosest.closestCity.y} black\n`);
        return acc + buildRoute(cities, currentWithClosest.closestCity, acc);
    } else {
        acc += euclideanDistance(firstCity.x, firstCity.y, currentCity.x, currentCity.y);
        path.push(currentCity);
        stream.write(`line ${currentCity.x},${currentCity.y} ${firstCity.x},${firstCity.y} black\n`);
        path.push(firstCity);
        //console.log(acc);
        return acc;
    }
};

// const stream = fs.createWriteStream('logs20.txt', {flags: 'a'});
// let accumulator = 0;
// let firstCity = twentyCities[0];
// buildRoute(twentyCities, twentyCities[0], accumulator);
// stream.end();

// const stream = fs.createWriteStream('logs100.txt', {flags: 'a'});
// let accumulator = 0;
// let firstCity = hundredCities[0];
// buildRoute(hundredCities,hundredCities[0], accumulator);
// stream.end();

const stream = fs.createWriteStream('logs1000.txt', {flags: 'a'});
let accumulator = 0;
let firstCity = thousandCities[0];
buildRoute(thousandCities, thousandCities[0], accumulator);
stream.end();

const calculatePathLength = (path) => {
    let acc = 0;
    for (let i = 1; i < path.length; i++) {
        acc += euclideanDistance(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
    }
    acc += euclideanDistance(path[path.length - 1].x, path[path.length - 1].y, path[0].x, path[0].y);
    return acc;
};

const twoOpt = (path) => {
    let localPath = [...path];
    localPath.pop();
    let newPath = [...path];
    newPath.pop();
    let size = localPath.length;
    let improve = 0;

    const TwoOptSwap = (i, k) => {
        for (let c = 0; c <= i - 1; ++c) {
            newPath[c] = localPath[c];
        }
        let dec = 0;
        for (let c = i; c <= k; ++c) {
            newPath[c] = localPath[k - dec];
            dec++;
        }
        for (let c = k + 1; c < size; ++c) {
            newPath[c] = localPath[c];
        }
    };

    let bestDistance;
    let counter = 0;
    while (improve < 10) {
        bestDistance = calculatePathLength(localPath);
        counter++;
        for (let i = 0; i < size - 1; i++) {
            for (let k = i + 1; k < size; k++) {
                TwoOptSwap(i, k);
                let newDistance = calculatePathLength(newPath);
                if (newDistance < bestDistance) {
                    improve = 0;
                    // localPath = newPath;
                    localPath = [...newPath];
                    bestDistance = newDistance;
                    //console.log(newDistance);
                }
            }
        }
        improve++;
    }
    console.log(bestDistance);
    console.log(`Counter: ${counter}`);
    return newPath;
};

const logOptimizedPath = (optimizedPath, filename) => {
    const stream = fs.createWriteStream(filename, {flags: 'w'});
    for (let i = 1; i < optimizedPath.length; i++) {
        stream.write(`line ${optimizedPath[i - 1].x},${optimizedPath[i - 1].y} ${optimizedPath[i].x},${optimizedPath[i].y} black\n`);
    }
    stream.write(`line ${optimizedPath[optimizedPath.length - 1].x},${optimizedPath[optimizedPath.length - 1].y} ${optimizedPath[0].x},${optimizedPath[0].y} black\n`);

    stream.end();
};

const buildRandomPath = (raw) => {
    const shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    let vertexArray = [];
    raw.split(/\n/).forEach((row) => {
        let split = row.split(" ");
        vertexArray.push(new City(parseInt(split[0]), parseInt(split[1])));
    });
    return shuffle(vertexArray);
};

const hrstart = process.hrtime();
let optimizedRandomPath = twoOpt(buildRandomPath(thousand));
const hrend = process.hrtime(hrstart);
console.log(`Time: ${hrend[0]}s`);

let optimizedPath = twoOpt(path);
logOptimizedPath(optimizedPath, 'optimized1000.txt');