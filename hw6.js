// Task 1: Quasi-Tagged Templates

// You are working on a localization library that uses tagged 
// templates to handle multiple languages. Implement a function 
// called localize that acts as a quasi-tagged template. The
// function should take a template string and an object
// containing language-specific translations. It should replace
// placeholders in the template string with the corresponding 
// translations from the provided object.

const translations = {
    en: {
        greet: "Hello",
        intro: "Welcome to our website"
    },
    fr: {
        greet: "Bonjour",
        intro: "Bienvenue sur notre site web"
    }
};

const language = "fr"; // Change to "en" for English
const greeting = "greet";
const introduction = "intro";

const localize = (strings, ...phrases) => {
    {
        let res = '';
        let curString;
        let curPhrase;
        for (let i = 0; i < Math.max(strings.length, phrases.length); i++) {
            curString = strings[i] !== undefined ? strings[i] : '';
            try {
                curPhrase = phrases[i] !== undefined ? `${translations[language][phrases[i]]}` : '';
            }
            catch (e) {
                curPhrase = '';
                console.log(e);
            }
            res += curString + curPhrase;
        }
        return res;
    }
}

const localizedGreeting = localize`UserName, ${greeting}!`;
const localizedIntroduction = localize`${introduction} :)`;
console.log(localizedGreeting); // Expected: "Bonjour" (for language "fr")
console.log(localizedIntroduction); // Expected: "Bienvenue sur notre site web" (for language "fr")

// Task 2: Advanced Tagged Template

// Create a function called highlightKeywords that acts as
//  a tagged template. The function should take a template
//  string and an array of keywords. It should highlight each
//  occurrence of a keyword in the template by wrapping it in
//  a <span> element with a specific CSS class. Use template
//  literals and string manipulation to achieve this.
/**
 * 
 * @param {string} template 
 * @param {Array<string>} keywords 
 */
const highlightKeywords = (template, keywords) => {
    const wrap = (str, spanClass = 'highlight') =>
        `<span class='${spanClass}'>${str}</span>`;
    let res = template;
    keywords.forEach((keyword, index) => {
        res = res.replace(`\${${index}}`, wrap(keyword));
    })
    return res;


}
const keywords = ["JavaScript", "template", "tagged"];
const template = "Learn \${0} tagged templates to create custom \${1} literals for \${2} manipulation.";
const highlighted = highlightKeywords(template, keywords);
console.log(highlighted);


// Expected: "Learn <span class='highlight'>JavaScript</span> 
// tagged templates to create custom <span class='highlight'>template</span>
//  literals for <span class='highlight'>tagged</span> manipulation."

// Task 3: Multiline Tagged Template

// Implement a multiline tagged template function called multiline that 
// takes a template string and returns a string with line numbers added
// at the beginning of each line. The line numbers should start from 1
// and increase for each line. Preserve the original indentation of each line.
/**
 * @param {Array<string>} strArr 
 */
function multiline(strArr) {
    let i = -1;
    let count = 0;
    let str = strArr[0];
    while ((i = str.indexOf('\n', i + 1)) !== -1) {
        str = str.slice(0, i + 1) + (++count) + ' ' + str.slice(i + 1);
        i += count.toString().length + 1;
    }
    return str;
}

const code = multiline`
function add(a, b) {
return a + b;
}`;

console.log(code);

// Expected:
// "1 function add(a, b) {
//  2 return a + b;
//  3 }"



// Task 4: Implementing Debounce Function

// Your task is to implement a debounce function that takes a function
//  and a delay time as arguments. The goal of the debounce function 
// is to ensure that the provided function is only executed after the
//  user stops invoking it for the specified delay time.


// Instructions

// Implement a function called debounce that takes two arguments:
// func: The function to be debounced.
// delay: The delay time (in milliseconds) before the function is executed.

// The debounce function should return a new function that wraps the provided function.

// When the new function is invoked, it should:
// Clear any existing timeout.
// Set a new timeout to execute the provided function after the specified delay time.

// Test your debounce function by using it to debounce an input event listener. 
// Ensure that the provided function is only called once after the user stops 
// typing for the specified delay time.

/**
 * 
 * @param {Function} func 
 * @param {number} delay 
 */
function debounce(func, delay) {
    let timeout = -1;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay, ...args);
    }
}

function debouncedSearch(query) {
    // Perform search operation with the query
    console.log("Searching for:", query);
}

const debouncedSearchHandler = debounce(debouncedSearch, 2000);

// const inputElement = document.getElementById("search-input");
// inputElement.addEventListener("input", event => {
//     debouncedSearchHandler(event.target.value);
// });



// Task 5: Implementing Throttle Function

// Your task is to implement a throttle function that takes a function
//  and a time interval as arguments. The throttle function should ensure
//  that the provided function is executed at most once within the
//  specified time interval.

// Instructions

// 1. Implement a function called `throttle` that takes two arguments:
// `func`: The function to be throttled.
// interval: The time interval (in milliseconds) within which the function
//  can be executed.

// The throttle function should return a new function that wraps the 
// provided function.

// When the new function is invoked, it should:
// Check if the specified time interval has elapsed since the last 
// execution of the provided function.
// If the interval has not elapsed, ignore the invocation.
// If the interval has elapsed, execute the provided function and 
// update the last execution timestamp.


function throttle(func, interval) {
    let timeout = -1;
    let elapsed = true;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(
            () => { elapsed = true; },
            interval);
        if (elapsed) {
            func(...args);
            elapsed = false;
        }
        else {
            console.log('not elapsed');
        }
    }
}

// Test your throttle function by using it to throttle a scroll event 
// listener. Ensure that the provided function is executed at most once
// within the specified time interval during rapid scrolling.

function onScroll(event) {
    // Handle scroll event
    console.log("Scroll event:", event);
}

const throttledScrollHandler = throttle(onScroll, 1000);
// window.addEventListener("scroll", throttledScrollHandler);


// Task 6: Currying Function Implementation
// Your task is to implement a currying function that converts a given
// function into a curried version. Currying is a technique in which 
// a function that takes multiple arguments is transformed into a
// sequence of functions, each taking a single argument.

// Instructions

// Implement a function called curry that takes two arguments:
// func: The function to be curried.
// arity: The number of arguments the original function takes.

// The curry function should return a new curried function.

// The curried function should keep accepting arguments until
//  it has received the specified number of arguments (arity).
//  Once all arguments are received, the original function should
//  be executed with the collected arguments.

// The curried function should keep accepting arguments until it
//  has received the specified number of arguments (arity). Once
//  all arguments are received, the original function should be 
// executed with the collected arguments.
/**
 * 
 * @param {Function} func 
 * @param {number} arity 
 */
function curry(func, arity) {
    const args = [];
    return curried = (arg) => {
        args.push(arg);
        if (args.length === arity) {
            return func(...args);
        }
        else {
            return curried;
        }
    };

}

function multiply(a, b, c) {
    return a * b * c;
}

const curriedMultiply = curry(multiply, 3);

const step1 = curriedMultiply(2); // Returns a curried function
const step2 = step1(3); // Returns a curried function
const result = step2(4); // Returns the final result: 2 * 3 * 4 = 24

{ { console.log("Result:", result); } }
// Expected: 24

