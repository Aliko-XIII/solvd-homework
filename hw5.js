// Homework 5

// Task 1: Advanced Array Filtering
// Create a function called customFilterUnique that takes an array and
// a callback function as arguments. The customFilterUnique function 
// should filter the array using the callback function to determine
//  uniqueness. The resulting array should contain only unique elements
//  based on the callback's logic.

// Use the customFilterUnique function to filter an array of objects based
//  on a specific property and return only unique objects. 
/**
 * @param {Array} arr 
 * @param {Function} cb 
 */
function customFilterUnique(arr, cb) {
    const arrCopy = [...arr];
    arrCopy.forEach(el => {

    });

}

// Task 2: Array Chunking
// Create a function called chunkArray that takes an array and a chunk size
//  as arguments. The chunkArray function should divide the array into smaller
//  arrays, each containing elements of the specified chunk size. The function
//  should return an array of arrays.

// Optimize the chunkArray function to minimize memory usage while chunking the array.
/**
 * @param {Array} arr 
 * @param {number} size 
 */
function chunkArray(arr, size) {
    let res = []
    let count = 0
    while (count < arr.length) {
        res.push(arr.slice(count, count + size));
        count += size;
    }
    return res;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 2));
console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3));

// Task 3: Array Shuffling
// Create a function called customShuffle that takes an array as an argument
//  and returns a new array with its elements randomly shuffled.
// Implement the customShuffle function using an efficient shuffling algorithm
//  to achieve uniform randomness.
function customShuffle(arr) {
    const copy = [...arr];
    const shuffleNum = 5;
    for (let i = 0; i < shuffleNum; i++) {
        let from = Math.floor(Math.random() * arr.length);
        let to = Math.floor(Math.random() * arr.length);
        [copy[from], copy[to]] = [copy[to], copy[from]]
    }
    return copy;
}

console.log(customShuffle([1, 2, 3, 4, 5]));

// Task 4: Array Intersection and Union
// Create a function called getArrayIntersection that takes two arrays as
// arguments and returns a new array containing the common elements
// between the two arrays.
/**
 * @param {Array} arr1 
 * @param {Array} arr2 
 */
function getArrayIntersection(arr1, arr2) {
    const res = []
    arr1.forEach(val =>
        arr2.indexOf(val) !== -1 && res.indexOf(val) === -1 ?
            res.push(val) : null);
    return res;
}

console.log(getArrayIntersection(
    [1, 2, 3, 3, 3, 7],
    [5, 7, 4, 1, 3, 2, 2, 0]));

// Create a function called getArrayUnion that takes two arrays as 
// arguments and returns a new array containing all unique elements 
// from both arrays, without any duplicates.
/**
 * @param {Array} arr1 
 * @param {Array} arr2 
 */
function getArrayUnion(arr1, arr2) {
    const res = []
    const len = Math.max(arr1.length, arr2.length);
    console.log(len);
    for (let i = 0; i < len; i++) {
        if (i < arr1.length && res.indexOf(arr1[i]) === -1) {
            res.push(arr1[i]);
        }
        if (i < arr2.length && res.indexOf(arr2[i]) === -1) {
            res.push(arr2[i]);
        }
    }
    return res;
}

console.log(getArrayUnion(
    [1, 2, 3, 3, 3, 7],
    [5, 7, 4, 1, 3, 2, 2, 0]));

// Task 5: Array Performance Analysis
// Implement a function called measureArrayPerformance that takes a function 
// and an array as arguments. The measureArrayPerformance function should 
// execute the provided function with the given array as input and measure 
// the execution time.
function measureArrayPerformance(fn, arr) {
    let start = process.hrtime.bigint();
    fn(arr);
    let finish = process.hrtime.bigint();
    return Number(finish - start) * 0.000001;
}

// Use the measureArrayPerformance function to compare the performance of
// built-in array methods (map, filter, reduce, etc.) against your custom
// array manipulation functions.

{
    {
        console.log('Custom fun: ' +
            measureArrayPerformance(customShuffle, [1, 2, 3, 4, 5]));

        console.log('Custom fun: ' +
            measureArrayPerformance(()=>{}, [1, 2, 3, 4, 5]));

    }
}