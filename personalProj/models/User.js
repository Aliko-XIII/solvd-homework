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
    constructor(name, surname, phone, password, age, sex = "Empty", id = -1) {
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
        this.phone = phone;
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
            const user = new User(row.first_name, row.last_name, row.phone,
                row.pass, row.age, row.sex, row.user_id
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

    static async getUserByPhone(phone) {
        const res = await query(`SELECT * FROM users 
            WHERE phone = '${phone}';`);
        return (await this.getUsersFromData(res.rows))[0];
    }

    /**
     * 
     * @param {User} user 
     */
    async insertUser() {
        const res = await query(`INSERT INTO users
            (first_name, last_name, age, sex, pass, phone)
            VALUES ('${this.name}', '${this.surname}', ${this.age}, 
            '${this.sex}', '${this.password}', '${this.phone}') RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
    }

    async deleteUser() {
        const res = await query(`DELETE FROM users WHERE id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}


module.exports = { User };

