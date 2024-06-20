const { query } = require("../config/database");
// const { Role } = require("./Role");

/**
 * Class representing hosptial system's user.
 */
class User {
    /**
     * Link to the user's role with specific info.
     * @type {Role}
     */
    #role;

    /**
     * Constructor for User class.
     * @param {id} id - user's id
     * @param {string} name - user's name
     * @param {string} surname - user's surname
     * @param {number} age - user's age
     * @param {string} sex - user's sex
     * @param {string} password - user's password
     */
    constructor(id, name, surname, password, age, sex = "Empty") {
        if (typeof id !== 'number') {
            throw new Error('ID is not valid.')
        }
        this.id = id;

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

    /**
     * @param {Role} val
     */
    set role(val) {
        if (typeof val != 'object') {
            throw new Error('Role should be instance of Role class.');
        }
        this.#role = val;
    }

    /**
     * @returns {Role} 
     */
    get role() {
        return this.#role;
    }

    static async getUsersFromData(rows) {
        if (rows.length == 0) { return []; }
        const users = [];
        rows.forEach(row => {
            const user = new User(row.id, row.name, row.surname,
                row.password, row.age, row.sex
            );
            users.push(user);
        })
        return users;
    }

    static async getUsers() {
        const res = await query(`SELECT * FROM users;`);
        return await this.getUsersFromData(res.rows);
    }

    static async getUsersById(...id) {
        const res = await query(`SELECT * FROM users 
            WHERE id IN (${id.toString()});`);
        return await this.getUsersFromData(res.rows);
    }
}

module.exports = { User };
