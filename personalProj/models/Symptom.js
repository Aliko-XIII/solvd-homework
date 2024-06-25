const { query } = require("../config/database");

/**
 * Class representing patients' symptoms.
 */
class Symptom {
    constructor(name, description = '', id) {
        this.id = id;
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
        return `Symptom "${this.name}"
        Description: ${this.description.length == 0 ? 'Empty.' : this.description}
        Location: ${this.locationOrgan == null ? 'Not mentioned' : `\n` + this.locationOrgan.toString()}`;
    }

    static async getSymptomsFromData(rows) {
        if (rows.length == 0) { return []; }
        const symptoms = [];
        rows.forEach(row => {
            let symptom = new Symptom(row.name, row.description, row.id);
            symptoms.push(symptom);
        });
        return symptoms;
    }

    static async getSymptoms() {
        const res = await query(`SELECT * FROM symptoms;`);
        return await this.getSymptomsFromData(res.rows);
    }

    static async getSymptomsById(...id) {
        const res = await query(`SELECT * FROM symptoms 
            WHERE id IN (${id.toString()});`);
        return await this.getSymptomsFromData(res.rows);
    }

    async insertSymptom() {
        const res = await query(`INSERT INTO symptoms(
	        name, description)
            VALUES ('${this.name}', '${this.description}') RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
    }

    async deleteSymptom() {
        const res = await query(`DELETE FROM symptoms WHERE id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Symptom };
