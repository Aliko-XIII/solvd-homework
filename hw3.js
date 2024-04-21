// Implement a pure function called calculateDiscountedPrice that takes
//  an array of products and a discount percentage as arguments. The
//  function should return a new array of products with discounted prices
//  based on the given percentage, without modifying the original products.
function calculateDiscountedPrice(products, percent) {
    const productsCopy = JSON.parse(JSON.stringify(products));
    return productsCopy.map(
        product => { product['price'] *= (1 - percent); return product; });
}

// Create a pure function called calculateTotalPrice that takes an array of
//  products as an argument. The function should return the total price of
//  all products, without modifying the original array or its items.
function calculateTotalPrice(products) {
    const productsCopy = JSON.parse(JSON.stringify(products));
    return productsCopy.reduce((acc, val) => acc + val['price'], 0);
}

const myProducts = [
    {
        name: 'apple',
        price: 15
    },
    {
        name: 'butter',
        price: 55
    },
    {
        name: 'bread',
        price: 20
    },
    {
        name: 'orange',
        price: 25
    },
]
const myPercent = 0.13;

console.log(calculateDiscountedPrice(myProducts, myPercent));
console.log(calculateTotalPrice(myProducts));

function getFullName(person) {
    return `${person['firstName']} ${person['lastName']}`;
}
const myPerson = {
    firstName: 'John',
    lastName: 'Smith',
}
console.log(getFullName(myPerson));

// Create a function called filterUniqueWords that takes a string of text
//  and returns an array of unique words, sorted in alphabetical order,
//  without using explicit loops. Use function composition and point-free style.
const removeSymbols = text => text.replace(/[^a-zA-Z\s]/g, '');

const getWordsArr = text =>
    text.toLowerCase().split(' ').filter(w => w.length != 0);

const getUnique = wordsArr => [...new Set(wordsArr)];

const sortAlphabetical = wordsArr =>
    wordsArr.sort((a, b) => a.localeCompare(b));

const compose = (...fns) => (arg) => fns.reduceRight((acc, fn) => fn(acc), arg);
const filterUniqueWords = compose(
    sortAlphabetical, getUnique, getWordsArr, removeSymbols);

console.log(filterUniqueWords('Create a A function called filterUniqueWords' +
    ' Called that takes a TEXT string of text'));

// Implement a function called getAverageGrade that takes an array of student
//  objects, each containing a name and grades property. The function should
// return the average grade of all students, without modifying the original
//  array or its items. Use function composition and point-free style.
const students = [
    { name: 'Alice', grades: [8, 7, 6, 9, 8] },
    { name: 'Bob', grades: [6, 7, 8, 7, 9] },
    { name: 'Charlie', grades: [9, 8, 7, 9, 8] },
    { name: 'David', grades: [7, 6, 7, 8, 6] },
    { name: 'Eva', grades: [8, 9, 8, 7, 9] },
    { name: 'Fiona', grades: [9, 9, 8, 9, 8] },
    { name: 'George', grades: [6, 7, 8, 7, 8] },
    { name: 'Hannah', grades: [8, 8, 7, 9, 8] },
    { name: 'Ian', grades: [7, 8, 6, 7, 8] },
    { name: 'Jessica', grades: [9, 8, 9, 8, 9] }
];

const getCopy = obj => JSON.parse(JSON.stringify(obj));
const getAvgGradesArr = students => students.map(
    student => (student.grades.reduce((acc, cur) => (acc + cur), 0)) / student.grades.length)
const getGeneralAvg = grades => (grades.reduce((acc, cur) => (acc + cur), 0)) / grades.length;
const getAverageGrade = compose(getGeneralAvg, getAvgGradesArr, getCopy);

// Create a function called createCounter that returns a closure. The closure
//  should be a counter function that increments the count on each call and
//  returns the updated count. Each closure should have its own independent count.
const createCounter = () => {
    let count = 0;
    return () => count++;
}

const counter0 = createCounter();
const counter1 = createCounter();

console.log(counter0());
console.log(counter0());
console.log(counter0());

console.log(counter1());
console.log(counter1());


// Implement a higher-order function called repeatFunction that takes a function
//  and a number as arguments. The function should return a new function that
//  invokes the original function multiple times based on the provided number.
//  If the number is negative, the new function should invoke the original
//  function indefinitely until stopped.
const repeatFunction = (fn, num) => {
    return () => {
        if (num > 0) {
            while (num > 0) {
                num--;
                fn();
            }
        }
        else { setInterval(fn, 1000); }
    }
}
const repeatedFin = repeatFunction(() => { console.log('hi') }, 5);
const repeatedInfin = repeatFunction(() => { console.log('1') }, -1);
// repeatedFin();

// Implement a recursive function called calculateFactorial that calculates
// the factorial of a given number. Optimize the function to use tail call
// optimization to avoid stack overflow for large input numbers.
const calculateFactorial = (n, acc = 1) => {
    if (n <= 1)
        return acc
    return calculateFactorial(n - 1, n * acc)
}

console.log(calculateFactorial(123));

// Create a recursive function called power that takes a base and an exponent
//  as arguments. The function should calculate the power of the base to the
//  exponent using recursion.
const power = (base, exp) => {
    if (exp == 0) { return 1; }
    else if (exp > 0) { return base * power(base, exp - 1) }
    else { return 1 / base * power(base, exp + 1) }
}

console.log(power(2, 1012));


// Implement a lazy evaluation function called lazyMap that takes an
//  array and a mapping function. The function should return a lazy
//  generator that applies the mapping function to each element of
//  the array one at a time.

const lazyMap = (arr, mapFn) => {
    let fnArr = arr;
    let i = 0;
    return function next() {
        if (i >= fnArr.length) {
            return;
        }
        fnArr[i] = mapFn(fnArr[i]);
        i++;
    }
};

const arr = [1, 2, 3];
console.log(arr);
const next = lazyMap(arr, num => num += 1);
next();
console.log(arr);
next();
console.log(arr);
next();
console.log(arr);


// Create a lazy generator function called fibonacciGenerator that 
// generates Fibonacci numbers one at a time using lazy evaluation.

const fibonacciGenerator = (() => {
    let a = 0;
    let b = 1;
    return function next() {
        let res = a + b;
        a = b;
        b = res;
        return res;
    }
})();

console.log(fibonacciGenerator());
console.log(fibonacciGenerator());
console.log(fibonacciGenerator());
console.log(fibonacciGenerator());
console.log(fibonacciGenerator());
console.log(fibonacciGenerator());

