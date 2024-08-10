const { query } = require("../config/database");

/**
 * Class representing hosptial system's user.
 */
class User {
    /**
     * Constructor for User class.
     * @param {string} id - user's id
     * @param {string} firstName - user's first name
     * @param {string} lastName - user's last name
     * @param {string} pgone - user's phone number
     * @param {number} age - user's age
     * @param {string} sex - user's sex
     * @param {string} password - user's password
     */
    constructor(firstName, lastName, phone, password, age, sex, id = '') {
        if (!this.validateString(firstName)) throw new Error('First name is not valid.');
        if (!this.validateString(lastName)) throw new Error('Last name is not valid.');
        if (!this.validateString(phone)) throw new Error('Phone is not valid.');
        if (!this.validateString(password)) throw new Error('Password is not valid.');
        if (typeof age !== 'number' || age <= 0) throw new Error('Age is not valid.');
        if (!this.validateString(sex)) throw new Error('Sex is not valid.');
        if (typeof id !== 'string') throw new Error('User id is not valid.');

        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.password = password;
        this.age = age;
        this.sex = sex;
        this.id = id;
    }

    /**
     * Validates that the input value is a non-empty string.
     * 
     * @param {string} value - The value to validate.
     * @returns {boolean} - Returns true if the value is a non-empty string, otherwise false.
     */
    validateString(value) {
        return typeof value === 'string' && value.length > 0;
    }

    /**
     * Converts rows of user data into User objects.
     * 
     * @param {Array} rows - The rows of user data.
     * @returns {Promise<Array<User>>} - A promise that resolves to an array of User objects.
     */
    static async getUsersFromData(rows) {
        return rows.map(row => new User(row.first_name, row.last_name, row.phone,
            row.pass, row.age, row.sex, row.user_id));
    }

    /**
     * Retrieves all users from the database with optional filtering.
     * 
     * @param {Object} filters - The filters to apply.
     * @param {string} [filters.firstName] - Part of users' first name.
     * @param {string} [filters.lastName] - Part of users' last name.
     * @param {number} [filters.minAge] - Bottom border for users' age.
     * @param {number} [filters.maxAge] - Top border for users' age.
     * @param {string} [filters.sex] - User's sex.
     * @param {string} [filters.phone] - Part of users' phone number.
     * @returns {Promise<Array<User>>} - A promise that resolves to an array of User objects.
     */
    static async getUsers({ firstName, lastName, minAge, maxAge, sex, phone } = {}) {
        let queryStr = 'SELECT * FROM users';
        const conditions = [];
        if (firstName) conditions.push(`first_name ILIKE '%${firstName}%'`);
        if (lastName) conditions.push(`last_name ILIKE '%${lastName}%'`);
        if (minAge) conditions.push(`age >= ${minAge}`);
        if (maxAge) conditions.push(`age <= ${maxAge}`);
        if (sex) conditions.push(`sex = '${sex}'`);
        if (phone) conditions.push(`phone ILIKE '%${phone}%'`);

        if (conditions.length > 0) {
            queryStr += ` WHERE ${conditions.join(' AND ')}`;
        }

        const res = await query(queryStr);
        return await this.getUsersFromData(res.rows);
    }

    /**
     * Retrieves a user by their ID.
     * 
     * @param {string} id - The user ID.
     * @returns {Promise<User>} - A promise that resolves to a User object.
     */
    static async getUserById(id) {
        const res = await query(`SELECT * FROM users WHERE user_id = '${id.toString()}';`);
        return (await User.getUsersFromData(res.rows))[0];
    }

    /**
     * Retrieves multiple users by their IDs.
     * 
     * @param {string[]} ids - The user IDs.
     * @returns {Promise<Array<User>>} - A promise that resolves to an array of User objects.
     */
    static async getUsersByIds(ids) {
        const idArr = ids.map(id => `'${id.toString()}'`).join(',');
        const res = await query(`SELECT * FROM users WHERE user_id IN (${idArr});`);
        return User.getUsersFromData(res.rows);
    }

    /**
     * Retrieves a user by their phone number.
     * 
     * @param {string} phone - The user's phone number.
     * @returns {Promise<User>} - A promise that resolves to a User object.
     */
    static async getUserByPhone(phone) {
        const res = await query(`SELECT * FROM users WHERE phone = '${phone}';`);
        return (await this.getUsersFromData(res.rows))[0];
    }

    /**
     * Updates a user's information in the database.
     * 
     * @param {string} id - The user ID.
     * @param {Object} updates - The fields to update.
     * @param {string} [updates.firstName] - The new first name.
     * @param {string} [updates.lastName] - The new last name.
     * @param {number} [updates.age] - The new age.
     * @param {string} [updates.sex] - The new sex.
     * @param {string} [updates.pass] - The new password.
     * @param {string} [updates.phone] - The new phone number.
     */
    static async updateUser(id, { firstName, lastName, age, sex, pass, phone }) {
        if (!id) throw new Error('There is no id passed to update user record.');
        const hasParams = Object.keys({ firstName, lastName, age, sex, pass, phone })
            .some(key => key !== undefined);
        if (!hasParams) throw new Error('There are no params to update.');
        let queryStr = `UPDATE users SET\n`;
        const updates = [];
        if (firstName) updates.push(`first_name = '${firstName}'`);
        if (lastName) updates.push(`last_name = '${lastName}'`);
        if (age) updates.push(`age = ${age}`);
        if (sex) updates.push(`sex = '${sex}'`);
        if (pass) updates.push(`pass = '${pass}'`);
        if (phone) updates.push(`phone = '${phone}'`);
        if (updates.length > 0) {
            queryStr += ` ${updates.join(', ')} `; 
        }
        queryStr += `WHERE user_id = '${id}' RETURNING *; `;
        const res = await query(queryStr);
        const updated = res.rows[0];
        delete updated.pass;
        return updated;
    }

    /**
     * Inserts a new user into the database.
     * 
     * @returns {Promise<void>}
     */
    async insertUser() {
        const res = await query(`INSERT INTO users
            (first_name, last_name, age, sex, pass, phone)
        VALUES('${this.firstName}', '${this.lastName}', ${this.age},
            '${this.sex}', '${this.password}', '${this.phone}') RETURNING *; `);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
        return { id: this.id };
    }

    /**
     * Deletes the user from the database.
     * 
     * @returns {Promise<void>}
     */
    async deleteUser() {
        const res = await query(`DELETE FROM users WHERE user_id = '${this.id}' RETURNING *; `);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { User };

