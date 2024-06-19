const { client } = require("../config/database");

/**
 * Class representing patients' symptoms.
 */
class Symptom {
    constructor(name, locationOrgan = null, description = '') {
        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name;

        if (typeof this.locationOrgan !== 'object') {
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
            return res.rows;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

}

module.exports = { Symptom };