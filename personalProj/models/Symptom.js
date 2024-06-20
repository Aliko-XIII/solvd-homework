const { client } = require("../config/database");

/**
 * Class representing patients' symptoms.
 */
class Symptom {
    constructor(id, name, description = '', locationOrgan = null) {
        this.id = id;
        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name;

        if (typeof locationOrgan !== 'object') {
            throw new Error('Organ should be object');
        }
        this.locationOrgan = locationOrgan;

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

    static async getSymptoms() {
        try {
            const res = await client.query(`SELECT * FROM symptoms;`);
            const symptoms = [];
            res.rows.forEach(row => {
                let symptom = new Symptom(row.id, row.name, row.description);
                symptoms.push(symptom);
            });
            return symptoms;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

    static async getSymptomsById(...id) {
        try {
            const res = await client.query(`SELECT * FROM symptoms 
                WHERE id IN (${id.toString()});`);
            const symptoms = [];
            res.rows.forEach(row => {
                let symptom = new Symptom(row.id, row.name, row.description);
                symptoms.push(symptom);
            });
            return symptoms;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }
}


module.exports = { Symptom };
