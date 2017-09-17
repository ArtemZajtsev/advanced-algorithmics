let binarySearch = (array, target) => {
    let min = 0;
    let max = array.length - 1;
    let guess = Math.floor((max + min) / 2);
    while (array[guess] !== target) {
        if (array[guess] < target) {
            min = guess + 1;
        } else if (array[guess] > target) {
            max = guess - 1;
        }
        guess = Math.floor((max + min) / 2);
    }
    return guess;
};

/*let a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
binarySearch(a, 2);*/

let binarySearchMeasurements = (arraySize, ms) => {

    let arrayGenerator = (n) => {
        let arr = [];
        for (let i = 0; i < n; i++) {
            arr.push(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        }
        return arr;
    };

    let array = arrayGenerator(arraySize);
    array.sort((a, b) => a - b);
    let target = array[Math.floor(Math.random() * array.length)];
    let count = 0;
    let stopper = true;
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();
    while (stopper) {
        binarySearch(array, target);
        const diff = process.hrtime(time);
        count++;
        const timer = (diff[0] * NS_PER_SEC + diff[1]) / 1000000;
        if (timer >= ms) {
            stopper = false;
        }
    }
    console.log(`There was ${count} searches in ${ms / 1000} seconds for array size ${arraySize}`);
};

//binarySearchMeasurements(1000000,60000);

let dualPivotQuicksort = (input, lowIndex, highIndex) => {
    if (highIndex <= lowIndex) return input;

    let exchange = (arr, a, b) => {
        [arr[a], arr[b]] = [arr[b], arr[a]];
    };

    let pivot1 = input[lowIndex];
    let pivot2 = input[highIndex];

    if (pivot1 > pivot2) {
        exchange(input, lowIndex, highIndex);
        pivot1 = input[lowIndex];
        pivot2 = input[highIndex];
    } else if (pivot1 === pivot2) {
        while (pivot1 === pivot2 && lowIndex < highIndex) {
            lowIndex++;
            pivot1 = input[lowIndex];
        }
    }

    let i = lowIndex + 1;
    let lt = lowIndex + 1;
    let gt = highIndex - 1;

    while (i <= gt) {
        if (input[i] < pivot1) {
            exchange(input, i++, lt++);
        } else if (pivot2 < input[i]) {
            exchange(input, i, gt--);
        } else {
            i++;
        }
    }

    exchange(input, lowIndex, --lt);
    exchange(input, highIndex, ++gt);

    dualPivotQuicksort(input, lowIndex, lt - 1);
    dualPivotQuicksort(input, lt + 1, gt - 1);
    dualPivotQuicksort(input, gt + 1, highIndex);
};


//let a = [6, 1, 5, 2, 4, 3, 0];
//dualPivotQuicksort(a, 0, a.length - 1);

let dataGenerator = (n) => {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    }
    return arr;
};

let measurements = (repeats, amount, func) => {
    const NS_PER_SEC = 1e9;
    let diffArr = [];
    let text = '';
    for (let i = 0; i < repeats; i++) {
        let arr = dataGenerator(amount);
        const time = process.hrtime();
        if (func.length === 3) {
            text = 'Dual pivot Quicksort   ';
            dualPivotQuicksort(arr, 0, arr.length - 1);
        } else {
            text = 'Built In sort';
            arr.sort((a, b) => a - b);
        }
        const diff = process.hrtime(time);
        diffArr.push(diff[0] * NS_PER_SEC + diff[1]);
    }
    let avg = diffArr.reduce((p, c) => p + c, 0) / diffArr.length;
    console.log(`${text} average: ${avg / 1000000} ms`);
};

//measurements(100,1000000,dualPivotQuicksort);
//measurements(100,10,Array.prototype.sort);