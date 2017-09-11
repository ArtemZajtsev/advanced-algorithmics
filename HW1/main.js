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
    for (let i = 0; i < repeats; i++) {
        let arr = dataGenerator(amount);
        const time = process.hrtime();
        if (func.length === 3) {
            quickSort(arr, 0, arr.length - 1);
        } else {
            arr.sort((a, b) => a - b);
        }
        const diff = process.hrtime(time);
        console.log(`Iteration ${i} took ${diff[0]} seconds and ${diff[1]} nanoseconds`);
    }
};

measurements(100, 10000, quickSort);
measurements(100, 10000, Array.prototype.sort);
