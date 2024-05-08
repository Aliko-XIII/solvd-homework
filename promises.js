// Homework 7
// Task 1: Implement promiseAll Function
// Your task is to implement a function called promiseAll that mimics the behavior
// of Promise.all() . The function should accept an array of promises and return a
// single promise that resolves to an array of resolved values or rejects with the
// reason of the first rejected promise.
// Instructions
//  Implement a function called promiseAll that takes an array of promises as an
// argument.
//  The function should return a new promise that resolves when all promises in
// the input array have resolved, and rejects if any of the promises reject.
//  If all promises resolve, the resolved value of the returned promise should be
// an array containing the resolved values of the input promises, in the same
// order.
//  If any promise rejects, the returned promise should reject with the reason of
// the first rejected promise.
// Example
const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
];

/**
 * 
 * @param {Array<Promise>} promises 
 */
const promiseAll = async (promises) =>
    new Promise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
        }
        const res = []
        let counter = 0;
        promises.forEach((promise, index) => {
            promise.then(val => {
                res[index] = val;
                counter++;
                if (counter == promises.length) {
                    resolve(res);
                }
            }).catch(reason => reject(reason));
        });
    })

promiseAll(promises)
    .then(results => {
        console.log("All promises resolved:", results); // Expected: [1, 2, 3]
    })
    .catch(error => {
        console.error("At least one promise rejected:", error);
    });