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
        guess = Math.floor((max+min)/2);
    }
    console.log(guess);
    return guess;
};

let a = [0,1,2,3,4,5,6,7,8,9];
binarySearch(a,9);