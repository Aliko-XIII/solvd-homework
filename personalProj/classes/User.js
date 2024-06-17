/**
 * Class representing hosptial system's user.
 */
export class User{

    /**
     * Constructor for User class.
     * @param {string} name - user's name
     * @param {string} surname - user's surname
     * @param {number} age - user's age
     * @param {string} sex - user's sex
     * @param {string} password - user's password
     */
    constructor(name, surname, password, age, sex = "Empty") {

        if (typeof name !== 'string' ||
            name.length == 0
        ) {
            throw new Error('Name is not valid.')
        }
        this.name = name;

        if (typeof surname !== 'string' ||
            surname.length == 0
        ) {
            throw new Error('Surname is not valid.')
        }
        this.surname = surname;

        if (typeof password !== 'string' ||
            password.length == 0
        ) {
            throw new Error('Password is not valid.')
        }
        this.password = password;

        if (typeof sex !== 'string' ||
            sex.length == 0
        ) {
            throw new Error('Sex is not valid.')
        }
        this.sex = sex;

        if (typeof age !== 'number') {
            throw new Error('Age is not valid.')
        }
        this.age = age;
    }
}