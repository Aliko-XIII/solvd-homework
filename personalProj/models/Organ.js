const { client } = require("../config/database");

/**
 * Class representing treated organs.
 */
class Organ {
    constructor(id, name, description = '') {

        this.id = id;

        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name;`SELECT * FROM symptoms 
                WHERE id IN (${id.toString()});`

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
            const organs = [];
            res.rows.forEach(row => {
                let organ = new Organ(row.id, row.name, row.description);
                organs.push(organ);
            });
            return organs;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

    static async getOrgansById(...id) {
        try {
            const res = await client.query(`SELECT * FROM organs 
                WHERE id IN (${id.toString()});`);
            const organs = [];
            res.rows.forEach(row => {
                let organ = new Organ(row.id, row.name, row.description);
                organs.push(organ);
            });
            return organs;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

}

module.exports = { Organ };