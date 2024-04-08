// Create a JavaScript library that provides advanced data transformation functions.
//  The library should include the following features:


// addValues: Accepts two arguments of any type and performs the appropriate addition
//  operation based on the types of the arguments. The function should return the
//  result of the addition. If the addition is not possible, it should throw an error.

function addValues(arg1, arg2) {
    //adding arrays
    if (Array.isArray(arg1) && Array.isArray(arg2)) {
        return [...arg1, ...arg2]
    }
    else if ((Array.isArray(arg1) && !Array.isArray(arg2))
        || (Array.isArray(arg2) && !Array.isArray(arg1))) {
        const [arr, val] = Array.isArray(arg1) ?
            [arg1, arg2] : [arg2, arg1];
        return [...arr, val]
    }

    //adding objects
    if (typeof arg1 == 'object' && typeof arg2 == 'object') {
        return { ...arg1, ...arg2 }
    }
    else if ((typeof arg1 == 'object' && typeof arg2 != 'object')
        || (typeof arg1 != 'object' && typeof arg2 == 'object')) {
        throw new Error('Object type values cannot be added to other type values');
    }

    //types which cannot be added to any type
    if (typeof arg1 == 'symbol' || typeof arg2 == 'symbol') {
        throw new Error('Symbol type values cannot be added to other values');
    }
    if (typeof arg1 == 'function' || typeof arg2 == 'function') {
        throw new Error('Function type values cannot be added to other values');
    }
    if (typeof arg1 == 'undefined' || typeof arg2 == 'undefined') {
        throw new Error('Undefined values cannot be added to other values');
    }

    return arg1 + arg2;
}

const testAddValues = () => {
    // symbol
    try {
        console.log(addValues(Symbol(), Symbol()));
    }
    catch (error) {
        console.log(error.message);
    }
    // function
    try {
        console.log(addValues(() => { }, 'hello'));
    }
    catch (error) {
        console.log(error.message);
    }
    // objects
    console.log(addValues({ a: 3, b: 2 }, { a: 1, d: 2 }));
    try {
        console.log(addValues({ a: 3, b: 2 }, 'hello'));
    }
    catch (error) {
        console.log(error.message);
    }
    //null
    console.log(addValues(null, { a: 3, b: 2 }))
    // undefined
    try {
        console.log(addValues(undefined, { a: 3, b: 1 }));
    }
    catch (error) {
        console.log(error.message);
    }
    // arrays
    console.log(addValues([1, 2, 3], 4));
    console.log(addValues([1, 2, 3], [4, 5, 6]));
    //other basic types
    console.log(addValues(1, 2));
    console.log(addValues(1, '2'));
    console.log(addValues('hello', '2'));
    console.log(addValues(1, true));
    console.log(addValues(false, 'word'));
};

// stringifyValue: Accepts a single argument of any type and converts it to a string
//  representation. For objects and arrays, use JSON.stringify() for serialization.
//  For other types, use the appropriate built-in methods or operations to convert
//  them to strings.

function stringifyValue(arg) {
    if (typeof arg == 'object') {
        return JSON.stringify(arg);
    }
    if (typeof arg == 'undefined') {
        return 'undefined';
    }
    return arg.toString();
}

const testStringifyValue = () => {
    //object
    console.log(stringifyValue({ a: 3, b: 2, c: 3 }))
    //array
    console.log(stringifyValue([1, 2, 3]))
    //number
    console.log(stringifyValue(3))
    //bigint
    console.log(stringifyValue(3234534278543257865623478562347856732845683245))
    //boolean
    console.log(stringifyValue(true))
    //undefined
    console.log(stringifyValue(undefined))
    //string
    console.log(stringifyValue('string'))
    // function
    console.log(stringifyValue(function func() { }))
    // arrow function
    console.log(stringifyValue(() => { }))
    //symbols
    console.log(stringifyValue(Symbol('mySymbol')));
};

// invertBoolean: Accepts a single boolean argument and returns its inverted value.
//  If the argument is not a boolean, it should throw an error.
function invertBoolean(arg) {
    if (typeof arg == 'boolean') {
        return !arg;
    }
    throw new Error('Argument must be boolean')
}

const testInvertBoolean = () => {
    //boolean
    console.log(invertBoolean(true))
    console.log(invertBoolean(false))
    //other types
    try {
        console.log(invertBoolean(1))
    }
    catch (error) {
        console.log(error.message)
    }
    try {
        console.log(invertBoolean('hello'))
    }
    catch (error) {
        console.log(error.message)
    }
    try {
        console.log(invertBoolean([1, 2, 3]))
    }
    catch (error) {
        console.log(error.message)
    }

};

// convertToNumber: Accepts a single argument of any type and attempts to convert
//  it to a number. For strings, use parseFloat() or parseInt() for conversion.
//  For other types, use appropriate operations or functions to perform the conversion.
//  If the conversion is not possible, it should throw an error.
function convertToNumber(arg) {
    if (typeof arg == 'function'
        || (typeof arg == 'object')
        || typeof arg == 'symbol'
        || typeof arg == 'undefined') {
        throw new Error(`Value cannot be converted to number`)
    }
    if (typeof arg == 'number' || typeof arg == 'bigint') {
        return arg;
    }
    if (typeof arg == 'string') {
        if (parseFloat(arg) == arg) {
            return parseFloat(arg)
        }
        if (parseInt(arg) == arg) {
            return parseInt(arg)
        }
        throw new Error(`String "${arg}" cannot be parsed`)
    }
    if (typeof arg == 'boolean') {
        return +arg;
    }
}

const testConvertToNumber = () => {
    //number
    console.log(convertToNumber(3));
    console.log(convertToNumber(3.1));
    //string
    console.log(convertToNumber('3'));
    console.log(convertToNumber('3.1'));
    try {
        console.log(convertToNumber('word'));
    }
    catch (err) {
        console.log(err.message);
    }
    //boolean
    console.log(convertToNumber(true));
    //types that cannot be converted
    try {
        console.log(convertToNumber({ a: 3 }));
    }
    catch (err) {
        console.log(err.message);
    }
    try {
        console.log(convertToNumber([1, 2]));
    }
    catch (err) {
        console.log(err.message);
    }
    try {
        console.log(convertToNumber(() => { }));
    }
    catch (err) {
        console.log(err.message);
    }
    try {
        console.log(convertToNumber(Symbol()));
    }
    catch (err) {
        console.log(err.message);
    }
}

// coerceToType: Accepts two arguments: value and type. It attempts to convert the value
//  to the specified type using type coercion. The function should return the coerced value
//  if successful. If the coercion is not possible, it should throw an error.
function coerceToType(val, type) {
    if (type == 'number') {
        if (!Number.isNaN(+val)) {
            return +val;
        }
        else {
            throw new Error('Value cannot be coerced to number')
        }
    }
    if (type == 'boolean') {
        if (!!val == true || !!val == false) {
            return !!val;
        }
        else {
            throw new Error('Value cannot be coerced to boolean')
        }
    }
    if (type == 'string') {
        try {
            return val + '';
        }
        catch (err) {
            throw new Error('Type coercion cannot be made for symbol')
        }
    }
    throw new Error('Type coercion cannot be made for this type')
}

const testCoerceToType = () => {
    //number
    {
        console.log(coerceToType(3, 'number'))
        console.log(coerceToType(true, 'number'))
        console.log(coerceToType('3.3', 'number'))

        try {
            console.log(coerceToType({}, 'number'))
        }
        catch (err) {
            console.log(err.message)
        }

        console.log(coerceToType([], 'number'))
        console.log(coerceToType([1], 'number'))
        try {
            console.log(coerceToType([1, 2], 'number'))
        }
        catch (err) {
            console.log(err.message)
        }

        try {
            console.log(coerceToType(undefined, 'number'))
        }
        catch (err) {
            console.log(err.message)
        }
    }
    //boolean
    {
        console.log(coerceToType(3, 'boolean'))
        console.log(coerceToType(0, 'boolean'))
        console.log(coerceToType(true, 'boolean'))
        console.log(coerceToType(false, 'boolean'))
        console.log(coerceToType('word', 'boolean'))
        console.log(coerceToType('', 'boolean'))
        console.log(coerceToType({}, 'boolean'))
        console.log(coerceToType([], 'boolean'))
        console.log(coerceToType([false], 'boolean'))
        console.log(coerceToType(undefined, 'boolean'))
        console.log(coerceToType(Symbol(), 'boolean'))
    }
    //string
    {
        console.log(coerceToType(3, 'string'))
        console.log(coerceToType(true, 'string'))
        console.log(coerceToType('word', 'string'))
        console.log(coerceToType({}, 'string'))
        console.log(coerceToType(() => { }, 'string'))
        console.log(coerceToType([1, 2, 3], 'string'))
        console.log(coerceToType(undefined, 'string'))
        try {
            console.log(coerceToType(Symbol(), 'string'))
        }
        catch (err) {
            console.log(err.message);
        }
    }
    //for all other types result is error
    try {
        console.log(coerceToType(3, 'function'))
    }
    catch (err) {
        console.log(err.message);
    }
    try {
        console.log(coerceToType(3, 'object'))
    }
    catch (err) {
        console.log(err.message);
    }
}

// (Optional) Implement additional functions of your choice that demonstrate advanced
//  type conversion scenarios or cater to specific use cases related to primitive types.
//  You are encouraged to explore complex scenarios and push the limits of type conversion.


/**
* Returns val multiplied by mult number with the logic like in Python
* Objects are multiplied by multiplying their inner values with recursion
*
* @param {any} val The value to be multiplied.
* @param {number} mult The multiplier, must be a natural number.
* @return {any} Value multiplied by mult.
*/
function multiply(val, mult) {
    if (typeof val == 'number') {
        return val * mult;
    }
    else if (typeof val == 'bigint') {
        return val * BigInt(mult);
    }
    else if (typeof val == 'string') {
        return Array(mult).fill(val).join('');
    }
    else if (typeof val == 'object') {
        const res = {};
        Object.keys(val).forEach(key => {
            res[key] = multiply(val[key], mult);
        })
        return res;
    }
    return val;
}
// console.log(multiply({
//     a: '1',
//     b: {
//         d: 4n,
//         e: [0, 1, 'a']
//     },
//     c: 3
// },
//     3));