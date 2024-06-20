const { query } = require("../config/database");

/**
 * Class representing treated organs.
 */
class Organ {
    constructor(id, name, description = '') {

        this.id = id;

        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name; `SELECT * FROM symptoms 
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

    static async getOrgansFromData(rows) {
        if (rows.length == 0) { return []; }
        const organs = [];
        rows.forEach(row => {
            let organ = new Organ(row.id, row.name, row.description);
            organs.push(organ);
        });
        return organs;
    }

    static async getOrgans() {
        const res = await query(`SELECT * FROM organs;`);
        return await this.getOrgansFromData(res.rows);
    }

    static async getOrgansById(...id) {
        const res = await query(`SELECT * FROM organs 
            WHERE id IN (${id.toString()});`);
        return await this.getOrgansFromData(res.rows);
    }

}

module.exports = { Organ };