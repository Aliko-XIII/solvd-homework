const { query } = require("../config/database");

/**
 * Class representing treated organs.
 */
class Organ {
    constructor(name, description = '', id = -1) {

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
            let organ = new Organ(row.name, row.description, row.id);
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

    async insertOrgan() {
        const res = await query(`INSERT INTO organs(
	        name, description)
            VALUES ('${this.name}', '${this.description}') RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
    }

    async deleteOrgan() {
        const res = await query(`DELETE FROM organs WHERE id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Organ };