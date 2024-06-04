const util = require('util')

/**
 * Gets name of field's type.
 * @param {string} str - stringified object field
 * @param {boolean} isObjField - true if field is from object and not array
 * @returns {string} type name
 */
function getType(str, isObjField) {
    if (typeof str != 'string') return;
    //Object with regex to check types.
    //Each regex checks if string corresponds to certain value type.
    let typePatterns = {
        boolean: isObjField ? /:\s*(true|false)/g : /^(true|false)$/g,
        number: isObjField ? /:\s*\d+/g : /^\d+/g,
        string: isObjField ? /:\s*"/g : /^"/g,
        null: isObjField ? /:\s*null$/g : /^null$/g,
        object: isObjField ? /^"\w+":\s*{/g : /^{/g,
        array: isObjField ? /^"\w+":\s*[[]/g : /^\[/g,
    }
    //Iterate through type patterns to find type which corresponds to string
    let type;
    Object.keys(typePatterns).forEach(key => {
        if (str.search(typePatterns[key]) !== -1) {
            type = key;
        }
    })
    if (type == undefined) {
        throw new Error('Stringified value isn\'t valid. Type cannot be identified.');
    }
    return type;
}

/**
 * Returns object with parsed name and value of field.
 * @param {string} fieldStr - stringified field
 * @returns {Object} parsed field object
 */
const parseField = fieldStr => {
    //Object for field values
    const field = {
        name: undefined,
        value: undefined
    }
    //Get first sequence of word symbols which should be field's name
    const namePattern = /\w+/g;
    field.name = fieldStr.match(namePattern)[0];
    //Get field type
    const type = getType(fieldStr, true);
    //Parse string to get value depending on type
    let valueMatch;
    switch (type) {
        case 'string':
            valueMatch = fieldStr.match(/:\s*".*"/g)[0];
            valueMatch = valueMatch.slice(3, valueMatch.length - 1);
            field.value = valueMatch;
            break;
        case 'number':
            valueMatch = fieldStr.match(/:\s*.+/g)[0];
            valueMatch = valueMatch.slice(2);
            field.value = Number.parseFloat(valueMatch);
            break;
        case 'boolean':
            field.value = fieldStr.search(/: true/g) != -1;
            break;
        case 'null':
            field.value = null;
            break;
        case 'array':
            field.value = myJSONParse(fieldStr.match(/\[.*]/g)[0]);
            break;
        case 'object':
            field.value = myJSONParse(fieldStr.match(/{.*}/g)[0]);
            break;
        default:
            break;
    }
    if (field.name === undefined || field.name.length === 0) {
        throw new Error('Field name is not valid.')
    }
    if (field.value === undefined) {
        throw new Error('Field value is not valid.')
    }
    return field;
}

/**
 * 
 * @param {string} itemStr - stringified item
 * @returns {any} item value
 */
function parseItem(itemStr) {
    let value;
    //Get type
    const type = getType(itemStr, false);
    //Get value depending on type
    switch (type) {
        case 'string':
            value = itemStr.slice(1, itemStr.length - 1);
            break;
        case 'number':
            value = Number.parseFloat(itemStr);
            break;
        case 'boolean':
            value = itemStr.search(/true/g) != -1;
            break;
        case 'null':
            value = null;
            break;
        case 'array':
            value = myJSONParse(itemStr.match(/\[.*]/g)[0]);;
            break;
        case 'object':
            value = myJSONParse(itemStr.match(/{.*}/g)[0]);
            break;
        default:
            break;
    }
    if (value === undefined) {
        throw new Error('Element value is not valid.')
    }
    return value;
}

/**
 * Iterates through JSON from starting index till finds
 * end of the array or object
 * @param {string} jsonString - stringified JSON
 * @param {number} fieldIndex - index where start search
 * @returns {number} index of the end of object
 */
function getObjEnd(jsonString, fieldIndex, type) {
    if (type != 'array' && type != 'object') {
        throw new Error('Type should be "object" or "array".');
    }
    //Get bracket depending on object being array or object
    let [openBracket, closeBracket] = type == 'object'
        ? ['{', '}'] : ['[', ']'];
    const str = jsonString.substring(fieldIndex);
    //Start index where array starts
    let start = str.indexOf(openBracket);
    //Create stack and push first bracket
    const stack = [];
    stack.push(str[start]);
    //Boolean value if currenly read is string
    let inStr = false;
    let i = start;
    while (stack.length !== 0) {
        if (i == jsonString.length) throw new Error('End of object wasn\'t found.');
        i++
        //Continue if we are in string
        if (str[i] == '"') inStr = !inStr;
        if (inStr) continue;
        //Add to stack if array start
        if (str[i] == openBracket)
            stack.push(openBracket)
        //Remove from stack if array ends
        else if (str[i] == closeBracket)
            stack.pop();
    }
    return fieldIndex + i;
}

/**
 * Custom function for JSON string parsing
 * @param {string} jsonString - stringified JSON object
 * @returns {Object} parsed object
 */
function myJSONParse(jsonString) {
    //Trim and remove new lines, tabs
    jsonString = jsonString.replace(/\n/g, '').replace(/\t/g, '').trim();
    if (jsonString.search(/^{.*?}$/g) == -1 &&
        jsonString.search(/^\[.*?]$/g) == -1) {
        throw new Error('Object is not valid array or object')
    }
    //Create empty object
    let obj = jsonString[0] == '{' ? {} : [];
    //Pattern for finding object/array items
    const pattern = Array.isArray(obj) ?
        /({.*?}|\d+.\d+|\d+|(?<!^)\[.*?]|".*?"|true|false|null)/g :
        /"\w+":\s*(?:".*?"|\d+.\d+|\d+|true|false|null|{.*?}|[[].*?])/g;

    const itemStrings = [];
    while ((match = pattern.exec(jsonString)) !== null) {
        let type = getType(match[0], !Array.isArray(obj));
        if (type == 'array' || type == 'object') {
            let matchEnd = getObjEnd(jsonString, match.index, type);
            let matchString = jsonString.substring(match.index, matchEnd + 1);
            if (itemStrings.length == 0) {
                itemStrings.push(matchString)
            }
            else if (itemStrings[itemStrings.length - 1].indexOf(matchString) == -1) {
                itemStrings.push(matchString);
            }
        }
        else {
            if (itemStrings.length == 0) {
                itemStrings.push(match[0])
            }
            else if (itemStrings[itemStrings.length - 1].indexOf(match[0]) == -1) {
                itemStrings.push(match[0])
            }
        }

    }
    //Add items to object
    if (Array.isArray(obj)) {
        itemStrings.forEach(item => obj.push(parseItem(item)));
    }
    else {
        let parsedFields = itemStrings.map(item => parseField(item));
        parsedFields.forEach(field => {
            obj[field.name] = field.value;
        })
    }
    return obj;
}


/**
 * Reflection
 * 
 * It was impossible to tokenize values using some special symbols like colons
 * or commas, because those can be used inside strings or nested objects and
 * arrays.
 * 
 * So, I writed 2 separate patterns for finding items inside objects and arrays.
 * Those patterns find every possible type of value and match only needed 
 * part of string.
 * 
 * There was still a problem with nested objects and arrays. Because regex can
 * only match their brackets from first opening to the last closing or from first
 * opening to first closing. First one would be useless in most cases and it would
 * match most of the string in most cases. Second one is usefull, but it doesn't 
 * match all the string, so I wrote seperate function which iterates from match start 
 * till all the opening brackets are paired with the closing ones. And also if there are
 * many nested objects, regex will define them as separate items, so before adding new 
 * tokenized string, function checks if it is a part of already added "higher" object or
 * array.
 * 
 * Then we have only to define type and parse it. Regex checks if string correspond to
 * some type's pattern. Objects and arrays can store other types' patterns, so we need to
 * check for them the last.
 * And then we parse those strings with corresponding regex. If it's object or array we 
 * recursively call JSON parsing function. 
 */


//TEST CASES
let jsonArrString = `[
    42, 
    "Hello, World!",
    true, 
    null, 
    3.14159, 
    {
        "name": "Alice",
        "age": 30,
        "isStudent": false,
        "address": {
            "street": "123 Main St",
            "city": "Wonderland",
            "postalCode": "12345"
        }
    }, 
    [1, 2, 3, 4, 5], 
    ["a", "b", "c"],
    [
        {
            "title": "Book A",
            "author": "Author A"
        },
        {
            "title": "Book B",
            "author": "Author B"
        }
    ]
]`;

let jsonString1 = `{
    "string": "Hello, World!",
    "number": 42,
    "boolean": true,
    "null_value": null,
    "array": [1, 2, 3],
    "object": {
      "nested_string": "Nested string",
      "nested_number": 123
    }
  }`;

let superJson = `{
    "level1": {
      "level2": {
        "level3": [
          {
            "id": 1,
            "name": "Item1",
            "details": {
              "attributes": [
                {
                  "type": "A",
                  "value": {
                    "subvalue1": "Alpha",
                    "subvalue2": [
                      {"deep": "DeepValue1"},
                      {"deeper": ["DeepDeepValue1", "DeepDeepValue2"]}
                    ]
                  }
                },
                {
                  "type": "B",
                  "value": {
                    "subvalue1": "Beta",
                    "subvalue2": [
                      {"deep": "DeepValue2"},
                      {"deeper": ["DeepDeepValue3", "DeepDeepValue4"]}
                    ]
                  }
                }
              ],
              "meta": {
                "info": [
                  {"key": "key1", "value": "value1"},
                  {"key": "key2", "value": ["value2a", "value2b"]}
                ]
              }
            }
          },
          {
            "id": 2,
            "name": "Item2",
            "details": {
              "attributes": [
                {
                  "type": "C",
                  "value": {
                    "subvalue1": "Gamma",
                    "subvalue2": [
                      {"deep": "DeepValue3"},
                      {"deeper": ["DeepDeepValue5", "DeepDeepValue6"]}
                    ]
                  }
                },
                {
                  "type": "D",
                  "value": {
                    "subvalue1": "Delta",
                    "subvalue2": [
                      {"deep": "DeepValue4"},
                      {"deeper": ["DeepDeepValue7", "DeepDeepValue8"]}
                    ]
                  }
                }
              ],
              "meta": {
                "info": [
                  {"key": "key3", "value": "value3"},
                  {"key": "key4", "value": ["value4a", "value4b"]}
                ]
              }
            }
          }
        ]
      },
      "additionalInfo": {
        "moreLevels": {
          "level4": [
            {
              "data": [
                {
                  "info": "Info1",
                  "details": {
                    "type": "E",
                    "values": [
                      {"subvalue": "Epsilon", "more": {"deepValue": "DeepEpsilon"}},
                      {"subvalue": "Zeta", "more": {"deepValue": "DeepZeta"}}
                    ]
                  }
                },
                {
                  "info": "Info2",
                  "details": {
                    "type": "F",
                    "values": [
                      {"subvalue": "Eta", "more": {"deepValue": "DeepEta"}},
                      {"subvalue": "Theta", "more": {"deepValue": "DeepTheta"}}
                    ]
                  }
                }
              ]
            },
            {
              "data": [
                {
                  "info": "Info3",
                  "details": {
                    "type": "G",
                    "values": [
                      {"subvalue": "Iota", "more": {"deepValue": "DeepIota"}},
                      {"subvalue": "Kappa", "more": {"deepValue": "DeepKappa"}}
                    ]
                  }
                },
                {
                  "info": "Info4",
                  "details": {
                    "type": "H",
                    "values": [
                      {"subvalue": "Lambda", "more": {"deepValue": "DeepLambda"}},
                      {"subvalue": "Mu", "more": {"deepValue": "DeepMu"}}
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
  `;
const jsonString = '{"name": "John", "age": 30, "city": "New York"}';

console.log(util.inspect(myJSONParse(jsonString), { showHidden: false, depth: null, colors: true }));
console.log(util.inspect(myJSONParse(superJson), { showHidden: false, depth: null, colors: true }));
console.log(util.inspect(myJSONParse(jsonArrString), { showHidden: false, depth: null, colors: true }));
console.log(util.inspect(myJSONParse(jsonString1), { showHidden: false, depth: null, colors: true }));
