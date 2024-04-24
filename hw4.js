// Homework 4

// Task 1: Object Property Manipulation
// Create an object called person with the following properties and values:
//
// firstName: "John"
// lastName: "Doe"
// age: 30
// email: "john.doe@example.com"

const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com",
}

// Use property descriptors to make all properties of the person object 
// read-only and non-writable, so their values cannot be changed directly.
Object.keys(person).forEach(key =>
    Object.defineProperty(person, key, {
        writable: false,
    }));

// Implement a method called updateInfo on the person object that takes a 
// new info object as an argument. The info object should contain updated 
// values for any of the properties (e.g., { firstName: "Jane", age: 32 }).
// Ensure that this method adheres to the read-only property descriptor set earlier.
person.updateInfo = function (newInfo) {
    Object.keys(newInfo).forEach(key => {
        if (key in this) {
            Object.defineProperty(person, key,
                { value: newInfo[key] })
        }
    })
}
person.updateInfo({ firstName: 'bob' });
console.log(person);

// Create a new property called address on the person object with an initial value 
// of an empty object. Make this property non-enumerable and non-configurable.
Object.defineProperty(person, 'address', {
    value: {},
    enumerable: false,
    configurable: false
})
console.log(person)

// Task 2: Object Property Enumeration and Deletion
// Create a new object called product with the following properties and values:

// name: "Laptop"
// price: 1000
// quantity: 5

const product = {
    name: "Laptop",
    price: 1000,
    quantity: 5,
}

// Use property descriptors to make the price and quantity properties non-enumerable
// and non-writable.
Object.defineProperty(product, 'price',
    { enumerable: false, writable: false, });

Object.defineProperty(product, 'quantity',
    { enumerable: false, writable: false, });

// Implement a function called getTotalPrice that takes the product object as an
//  argument and returns the total price (calculated as price * quantity). Ensure
//  that the function accesses the non-enumerable properties directly using the
//  Object.getOwnPropertyDescriptor method.
function getTotalPrice(product) {
    const price = Object.getOwnPropertyDescriptor(product, 'price').value;
    const quantity = Object.getOwnPropertyDescriptor(product, 'quantity').value;
    return price * quantity;
}

console.log(getTotalPrice(product));

// Implement a function called deleteNonConfigurable that takes an object and
//  a property name as arguments. The function should delete the specified property
//  from the object if it exists. If the property is non-configurable, throw an error
//  with an appropriate message.
function deleteNonConfigurable(obj, prop) {
    const propDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (propDescriptor == undefined) { return; }
    if (propDescriptor.configurable == false) {
        throw new Error(`Property '${prop}' is non-configurable.`)
    };
    delete obj[prop];
}

deleteNonConfigurable(product, 'name');
console.log(product);

// Task 3: Object Property Getters and Setters
// Create an object called bankAccount with the following properties and values:
// balance: 1000 (default value)
const bankAccount = {
    _balance: 1000,
    get balance() {
        return this._balance;
    },
    // Use a setter to define a property called balance, which updates the account balance
    //  and automatically updates the corresponding formattedBalance value.
    set balance(val) {
        this._balance = val;
    },
    // Use a getter to define a property called formattedBalance, which returns the balance
    //  with a currency symbol (e.g., "$1000").
    get formattedBalance() {
        return `$${this._balance}`;
    },
    // Implement a method called transfer on the bankAccount object that takes two bankAccount
    //  objects and an amount as arguments. The method should transfer the specified amount
    //  from the current account to the target account. Ensure that the balance and
    //  formattedBalance properties of both accounts are updated correctly.
    transfer: function (target, amount) {
        if (this._balance < amount) {
            throw new Error('Balance is not enough for transfer');
        }
        this.balance -= amount;
        target.balance += amount;
    }
}

const acc1 = Object.create(bankAccount);
const acc2 = Object.create(bankAccount);

acc1.transfer(acc2, 300);

console.log(acc1.formattedBalance);
console.log(acc2.formattedBalance);

// Task 4: Advanced Property Descriptors
// Implement a function called createImmutableObject that takes an object as an argument
//  and returns a new object with all its properties made read-only and non-writable using
//  property descriptors. The function should handle nested objects and arrays recursively.
// Use the createImmutableObject function to create an immutable version of the person object
//  from Task 1.

function createImmutableObject(obj) {
    const newObj = Array.isArray(obj) ? [] : {};
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    Object.keys(descriptors).forEach(key => {
        let val = typeof obj[key] == 'object' ?
            createImmutableObject(descriptors[key].value)
            : descriptors[key].value;
        Object.defineProperty(newObj, key,
            {
                value: val,
                writable: false,
                enumerable: descriptors[key].enumerable,
                configurable: descriptors[key].configurable
            });
    })
    return newObj;
}

const immut1 = createImmutableObject(person);
console.log(Object.getOwnPropertyDescriptors(immut1));

// Task 5: Object Observation
// Implement a function called observeObject that takes an object and a callback function as
//  arguments. The function should return a proxy object that wraps the original object and
//  invokes the callback function whenever any property of the object is accessed or modified.
// Use the observeObject function to create a proxy for the person object from Task 1. The 
// callback function should log the property name and the action (get or set) performed 
// on the object.
function observeObject(obj, fn) {
    const proxy = {
        get obj() {
            return this._obj;
        },
        set obj(val) {
            this._obj = val;
        }
    };
    proxy.obj = obj;
    Object.keys(proxy.obj).forEach(key => {
        Object.defineProperty(proxy, key,
            {
                get: function get() {
                    fn(proxy.obj, 'get');
                    return proxy.obj[key];
                },
                set: function set(val) {
                    fn(proxy.obj, 'set');
                    proxy.obj[key] = val;
                }
            });
    })

    return proxy;
}
const proxy = observeObject(person, (obj, method) => {
    console.log(`You use ${method} for property of person ${obj.firstName} ${obj.lastName}`);
})
console.log(proxy.firstName);
proxy.firstName = 'jake';

// Task 6: Object Deep Cloning
// Implement a function called deepCloneObject that takes an object as an argument and returns
//  a deep copy of the object. The function should handle circular references and complex nested
//  structures. Do not use JSON methods.
function deepCloneObject(clonedObj) {
    let globalNewObj;
    let firstIter = true;
    function copyFields(curObj) {
        const newObj = Array.isArray(curObj) ? [] : {};
        if (firstIter) {
            globalNewObj = newObj;
            firstIter = false;
        }

        const descriptors = Object.getOwnPropertyDescriptors(curObj);
        Object.keys(descriptors).forEach(key => {
            let val;
            if (typeof descriptors[key].value == 'object') {
                val = descriptors[key].value == clonedObj ?
                    globalNewObj :
                    copyFields(descriptors[key].value)
            }
            else {
                val = descriptors[key].value;
            }
            Object.defineProperty(newObj, key, {
                value: val,
                writable: descriptors[key].writable,
                enumerable: descriptors[key].enumerable,
                configurable: descriptors[key].enumerable,
            });
        })
        return newObj;
    }
    copyFields(clonedObj);
    return globalNewObj;
}

const obj1 = {
    a: 3,
    b: 2,
    c: {
        d: 6,
        e: 51
    }
};
Object.defineProperty(obj1.c, 'f', { value: obj1, enumerable: true });

const clone = deepCloneObject(obj1);
console.log(clone);
console.log(clone == obj1);
console.log(clone == clone.c.f);

// Task 7: Object Property Validation
// Implement a function called validateObject that takes an object and a validation schema
//  as arguments. The schema should define the required properties, their types, and any
//  additional validation rules. The function should return true if the object matches the
//  schema, and false otherwise. You can choose any schema you want.
function validateObject(obj, schema) {
    let valid = true;
    for (let key in obj) {
        //check type
        console.log(
            typeof obj[key] == schema[key].type && schema[key].type != 'array' || (schema[key].type == 'array' && Array.isArray(obj[key])))
        const typeValid = ((typeof obj[key] == schema[key].type && schema[key].type != 'array')
            || (schema[key].type == 'array' && Array.isArray(obj[key])));
        console.log(typeValid);
        if (!typeValid) {
            return false;
        }
    }
    return true;
}

const book = {
    name: 'BookName',
    author: 'John Smith',
    year: 2001,
    characters: ['Jake', 'Mike', 'Leonard'],
    saleProps: {
        retailers: ['BookWorld', 'FantasyPages'],
        default: 500,
        softCover: 350,
        soldOut: false
    },
    chapterLengthes: {
        introduction: 5,
        chapt1: 15,
        chapt2: 14,
        chapt3: 17,
        final: 10
    }
}

const schema = {
    name: {
        type: 'strg',
        additionalValidators: [
            val => val.length < 100,
            val => val.length > 0
        ]
    },
    author: {
        type: 'string',
        additionalValidators: [
            val => val.length < 100,
            val => val.length > 0,
            val => (/\d/).test(val)
        ]
    },
    year: {
        type: 'number',
        additionalValidators: [
            val => val > 0,
            val => val <= (new Date).getFullYear(),
            val => (/\d/).test(val)
        ]
    },
    characters: {
        type: 'array',
        innerTypes: ['string'],
        additionalValidators: [
            val => {
                val.forEach(el => {
                    if ((typeof el == 'string') && el.length <= 0) {
                        return false;
                    };
                })
                return true;
            }
        ]
    },
    saleProps: {
        type: 'object',
        innerSchema: {
            retailers: {
                type: 'array',
                innerTypes: ['string'],
                additionalValidators: [
                    val => {
                        val.forEach(el => {
                            if ((typeof el == 'string') && el.length <= 0) {
                                return false;
                            };
                        })
                        return true;
                    }
                ]
            },
            default: {
                type: 'number',
                additionalValidators: [
                    val => val > 0,
                ]
            },
            softCover: {
                type: 'number',
                additionalValidators: [
                    val => val > 0,
                ]
            },
            soldOut: {
                type: 'boolean',
                additionalValidators: [
                ]
            },
        }
    },
    chapterLengthes: {
        type: 'object',
        additionalValidators: [
            val => {
                Object.values(val).forEach(el => {
                    if ((typeof el == 'string') && el.length <= 0) {
                        return false;
                    };
                })
                return true;
            }
        ]

    }
}

{
    {
        console.log(validateObject(book, schema));
    }
}