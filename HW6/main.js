const fs = require('fs');

let rawData = fs.readFileSync('1000_keys.txt', 'utf-8');
let data = [];
rawData.split(/\n/).forEach((row) => {
    data.push(parseInt(row));
});

const universalHashing = (data, tableSize) => {
    //we just pick p one time because we know hash table size
    const tableSizeArr = [1000, 10000, 100000, 1000000];
    const pArr = [1223, 10177, 100279, 1000253];
    const p = pArr[tableSizeArr.indexOf(tableSize)];

    let hashTable = new Array(tableSize);
    let a = 0;
    do {
        a = Math.floor(Math.random() * p);
    } while (a === 0);
    let b = Math.floor(Math.random() * p);
    data.forEach((x) => {
        let h = ((a * x + b) % p) % tableSize;
        hashTable[h] = x;
    });
    //let collisions = data.length - hashTable.filter(() => {return true}).length;
    //console.log(`Collisions number: ${collisions}`);
    return data.length - hashTable.filter(() => {
        return true
    }).length;
};

const hashingMeasurements = (data, tableSize, repeats) => {
    let sum = 0;
    for (let i = 0; i < repeats; i++) {
        sum += universalHashing(data, tableSize)
    }
    console.log(sum / repeats);
    return sum / repeats;
};

//hashingMeasurements(data,1000,100);


let rawData2 = fs.readFileSync("words.txt", "utf-8");
let data2 = [];
rawData2.split(/\n/).forEach((x) => {
    data2.push(x);
});

const stringHashCodeFromJava = (string) => {
    let h = 0, i = 0;
    if (string.length > 0) {
        while (i < string.length) {
            h = (h << 5) - h + string.charCodeAt(i++) | 0;
        }
    }
    return h;
};

const wordMapping = (data, useSimpleApproach) => {
    let result = [];
    if (useSimpleApproach === true) {
        data.forEach((word) => {
            let sum = 0;
            for (let i = 0; i < word.length; i++) {
                sum += word.charCodeAt(i);
            }
            result[sum] = word;
        });
        console.log(`Percent of colliding integers in simple: ${((data.length - result.filter(() => {
            return true
        }).length) / data.length) * 100}% `);
    } else {
        let hashCodes = data.map(stringHashCodeFromJava);
        let set = new Set(hashCodes);
        console.log(`Percent of colliding integers in java approach: ${((data.length - set.size) / data.length) * 100}%`);
    }
    return result;
};

wordMapping(data2, true);
wordMapping(data2, false);
