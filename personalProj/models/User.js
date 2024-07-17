const { query } = require("../config/database");
// const { Role } = require("./Role");

/**
 * Class representing hosptial system's user.
 */
class User {
    /**
     * Constructor for User class.
     * @param {string} id - user's id
     * @param {string} firstName - user's first name
     * @param {string} lastName - user's last name
     * @param {number} age - user's age
     * @param {string} sex - user's sex
     * @param {string} password - user's password
     */
    constructor(firstName, lastName, phone, password, age, sex, id = '') {
        if (typeof firstName !== 'string' ||
            firstName.length == 0
        ) {
            throw new Error('Name is not valid.')
        }
        this.firstName = firstName;

        if (typeof lastName !== 'string' ||
            lastName.length == 0
        ) {
            throw new Error('Last name is not valid.')
        }
        this.lastName = lastName;

        if (typeof phone !== 'string' ||
            phone.length == 0
        ) {
            throw new Error('Phone is not valid.')
        }
        this.phone = phone;

        if (typeof password !== 'string' ||
            password.length == 0
        ) {
            throw new Error('Password is not valid.')
        }
        this.password = password;

        if (typeof age !== 'number') {
            throw new Error('Age is not valid.')
        }
        this.age = age;

        if (typeof sex !== 'string' ||
            sex.length == 0
        ) {
            throw new Error('Sex is not valid.')
        }
        this.sex = sex;

        if (typeof id !== 'string') {
            throw new Error('User id is not valid.')
        }
        this.id = id;
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

    static async getUserById(id) {
        const res = await query(`SELECT * FROM users 
            WHERE user_id = '${id.toString()}';`);
        return (await this.getUsersFromData(res.rows))[0];
    }

    static async getUserByPhone(phone) {
        const res = await query(`SELECT * FROM users 
            WHERE phone = '${phone}';`);
        return (await this.getUsersFromData(res.rows))[0];
    }

    async updateUser(id, { firstName, lastName, age, sex, pass, phone }) {
        if (!id) throw new Error('There is no id passed to update user record.');
        const hasParams = Object.keys({ firstName, lastName, age, sex, pass, phone })
            .some(key => key !== undefined);
        if (!hasParams) throw new Error('There are no params to update.');
        let queryStr = `UPDATE public.users SET\n`;
        queryStr += `${firstName ? `first_name = '${firstName}', ` : ''}
            ${firstName ? `first_name = '${firstName}', ` : ''}
            ${lastName ? `last_name = '${lastName}', ` : ''}
            ${age ? `age = ${age}, ` : ''}
            ${sex ? `sex = '${sex}', ` : ''}
            ${pass ? `pass = '${pass}', ` : ''}
            ${phone ? `phone = '${phone}', ` : ''}`
        queryStr = queryStr.slice(0, queryStr.length - 1) + '\n';
        queryStr += `WHERE user_id='${id}';`;
        const res = await query(queryStr);
        this.id = res.rows[0].id;
        console.log('Updated:', res.rows[0]);
    }

    async insertUser() {
        const res = await query(`INSERT INTO users
            (first_name, last_name, age, sex, pass, phone)
            VALUES ('${this.firstName}', '${this.lastName}', ${this.age}, 
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

