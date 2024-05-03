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
{
    {
        const highlighted = highlightKeywords(template, keywords);
        console.log(highlighted);

    }
}

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

const inputElement = document.getElementById("search-input");
inputElement.addEventListener("input", event => {
    debouncedSearchHandler(event.target.value);
});