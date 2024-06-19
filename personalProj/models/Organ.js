const { client } = require("../config/database");

/**
 * Class representing treated organs.
 */
class Organ {
    constructor(name, description = '') {
        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name;

        if (typeof description !== 'string') {
            throw new Error('Description should be string');
        }
        this.description = description;
    }

    toString() {
        return `Organ "${this.name}"
        Description: ${this.description.length == 0 ? 'Empty.' : this.description}`;
    }

    static async getOrgans() {
        try {
            const res = await client.query(`SELECT * FROM organs;`);
            return res.rows;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }
}

module.exports = { Organ };