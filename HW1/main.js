let dataGenerator = (n) => {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    }
    return arr;
};

let quickSort = (arr, lo, hi) => {

    let partition = (arr, lo, hi) => {
        let pivot = arr[hi];
        let i = lo - 1;
        let j;
        for (j = lo; j <= hi - 1; j++) {
            if (arr[j] < pivot) {
                i = i + 1;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        if (arr[hi] < arr[i + 1]) {
            [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
        }
        return i + 1;

    };

    if (lo < hi) {
        let p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi)
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
            text = 'Quick Sort   ';
            quickSort(arr, 0, arr.length - 1);
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

//measurements(1, 10000000, quickSort);
//measurements(1, 10000000, Array.prototype.sort);

let randomSorting = (arr) => {

    let isSorted = (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                console.log('nope');
                return false;
            }
        }
        console.log('yup');
        return true;
    };

    while (!isSorted(arr)) {
        for (let i = 0; i < arr.length - 1; i++) {
            [arr[i], arr[Math.floor(Math.random() * (arr.length - 1))]] = [arr[Math.floor(Math.random() * (arr.length - 1))], arr[i]]
        }
    }

};

//let a = [1,9,2,8,3,7,4,6,0,5];
//randomSorting(a);