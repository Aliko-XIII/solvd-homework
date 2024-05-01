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

const language = "en"; // Change to "en" for English
const greeting = "greet";
const introduction = "intro";

const localize = (strings, ...phrases) => {
    {
        // if (!translations[language]) { throw new Error('Wrong language identifier.') }
        let res = '';
        let curString;
        let curPhrase;
        for (let i = 0; i < Math.max(strings.length, phrases.length); i++) {
            curString = strings[i] !== undefined ? strings[i] : '';
            try {
                curPhrase = phrases[i] !== undefined ? `${translations[language][phrases[i]]}` : '';
            }
            catch (e){
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
{
    {
        console.log(localizedGreeting); // Expected: "Bonjour" (for language "fr")
        console.log(localizedIntroduction); // Expected: "Bienvenue sur notre site web" (for language "fr")
    }
}

// Task 2: Advanced Tagged Template

// Create a function called highlightKeywords that acts as
//  a tagged template. The function should take a template
//  string and an array of keywords. It should highlight each
//  occurrence of a keyword in the template by wrapping it in
//  a <span> element with a specific CSS class. Use template
//  literals and string manipulation to achieve this.

const highlightKeywords = (strings) => {

}