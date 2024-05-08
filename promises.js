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

// Task 2: Implement promiseAllSettled Function

// Your task is to implement a function called promiseAllSettled that mimics the
// behavior of Promise.allSettled().The function should accept an array of promises
// and return a promise that resolves to an array of objects representing the
// settlement of each promise

// Instructions
//  Implement a function called promiseAllSettled that takes an array of promises
// as an argument.
//  The function should return a new promise that resolves with an array of
// objects representing the settlement of each promise in the input array.
//  Each object in the resolved array should have
// properties status and value or reason . The status can be
// either 'fulfilled' or 'rejected' , and value should hold the resolved value (if
// fulfilled) or reason should hold the rejection reason (if rejected).

/**
 * 
 * @param {Array<Promise>} promises 
 */
const promiseAllSettled = async (promises) =>
    new Promise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
        }
        const res = []
        let counter = 0;
        promises.forEach((promise, index) => {
            promise.then(val => {
                res[index] = {
                    status: 'fulfilled',
                    value: val
                };
            }).catch(reason => {
                res[index] = {
                    status: 'rejected',
                    reason: reason
                };
            }).finally(() => {
                counter++;
                if (counter == promises.length) {
                    resolve(res);
                }
            })
        });
    })

const promises2 = [
    Promise.resolve(1),
    Promise.reject("Error occurred"),
    Promise.resolve(3)
];
promiseAllSettled(promises2)
    .then(results => {
        console.log("All promises settled:", results);
        // Expected: [{ status: 'fulfilled', value: 1 },
        // { status: 'rejected', reason: 'Error occurred' },
        // { status: 'fulfilled', value: 3 }]
    });

// Task 3: Implement Chaining of Promises as a Separate Function
// Your task is to implement a function called chainPromises that facilitates chaining of
// promises.The function should accept an array of functions that return promises
// and execute them sequentially.

// Instructions
//  Implement a function called chainPromises that takes an array of functions as an
// argument.
//  Each function in the array should return a promise.
//  The chainPromises function should execute the functions sequentially, chaining
// the promises together.
//  The returned promise should resolve with the value of the last resolved
// promise or reject with the reason of the first rejected promise.
/**
 * 
 * @param {Array<Function>} functionsArray 
 */
const chainPromises = (functionsArray) =>
    new Promise((resolve, reject) => {
        let counter = 0;
        functionsArray.reduce((acc, func) => {
            if (counter === functionsArray.length - 1) {
                acc.then(val => {
                    resolve(func(val))
                })
            }
            counter++
            return acc.then(func)
                .catch(reason => { reject(reason) });
        }, Promise.resolve());
    })

// function asyncFunction1() {
//     return Promise.resolve("Result from asyncFunction1");
// }
// function asyncFunction2(data) {
//     return Promise.resolve(data + " - Result from asyncFunction2");
// }
// function asyncFunction3(data) {
//     return Promise.resolve(data + " - Result from asyncFunction3");
// }

function asyncFunction1() {
    return Promise.resolve("Result from asyncFunction1");
}
function asyncFunction2(data) {
    return Promise.reject("Some error of asyncFunction2");
}
function asyncFunction3(data) {
    return Promise.resolve(data + " - Result from asyncFunction3");
}

const functionsArray = [asyncFunction1, asyncFunction2, asyncFunction3];

chainPromises(functionsArray)
    .then(result => {
        console.log("Chained promise result:", result);
        // Expected: "Result from asyncFunction1 - Result from asyncFunction2 - Result from asyncFunction3"
    })
    .catch(error => {
        console.error("Chained promise error:", error);
    });