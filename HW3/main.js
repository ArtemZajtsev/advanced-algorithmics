const MAX_8_BIT = 255;
const MAX_32_BIT = 4294967295;
const MAX_64_BIT = 18446744073709551615;

const countingSort = (arr) => {
    const max = arr.reduce((x, y) => {
        return (x > y) ? x : y
    });
    const min = arr.reduce((x, y) => {
        return (x < y) ? x : y
    });
    let i, z = 0;
    let count = new Array(max + 1).fill(0, min, max + 1);
    arr.forEach((elem) => {
        count[elem]++;
    });
    for (i = min; i <= max; i++) {
        while (count[i]-- > 0) {
            arr[z++] = i;
        }
    }
    return arr;
};

const dataGenerator = (length, maxValue) => {
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * maxValue));
    }
    return arr;
};

let measurements = (repeats, length, maxValue, func) => {
    const NS_PER_SEC = 1e9;
    let diffArr = [];
    let text = '';
    for (let i = 0; i < repeats; i++) {
        let arr = dataGenerator(length, maxValue);
        const time = process.hrtime();
        if (func.sort && func.sort.name === 'sort') {
            text = 'Built In sort';
            arr.sort((a, b) => a - b);
        } else {
            text = 'Counting Sort';
            countingSort(arr);
        }
        const diff = process.hrtime(time);
        diffArr.push(diff[0] * NS_PER_SEC + diff[1]);
    }
    let avg = diffArr.reduce((p, c) => p + c, 0) / diffArr.length;
    console.log(`${text} average: ${avg / 1000000} ms for length ${length} and  ${maxValue} max value`);
};

measurements(100, 1000000, MAX_8_BIT, countingSort);
//measurements(100, 10, MAX_32_BIT, Array.prototype.sort());