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

let binarySearchMeasurements = (arraySize,ms) => {

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
        const timer = (diff[0]*NS_PER_SEC+diff[1])/1000000;
        if (timer >= ms) {
            stopper = false;
        }
    }
    console.log(`There was ${count} searches in ${ms/1000} seconds for array size ${arraySize}`);
};

binarySearchMeasurements(10,5000);