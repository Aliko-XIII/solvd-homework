const { Symptom } = require("./Symptom");
const { Organ } = require("./Organ");
const { query } = require("../config/database");

/**
 * Class representing doctors' specializations.
 */
class Specialization {
    /**
     * Constructor for Specialization class.
     * @param {string} name - The name of the doctor's specialization.
     * @param {string} description - A description of the doctor's specialization.
     * @param {Symptom[]} symptoms - The symptoms treated with the doctor's specialization.
     * @param {Organ[]} organs - The organs treated with the doctor's specialization.
     * @param {number} [id=-1] - The ID of the specialization (optional).
     */
    constructor(name, description = '', symptoms = [], organs = [], id = -1) {
        if (typeof name !== 'string') throw new Error('Name should be string');
        if (typeof description !== 'string') throw new Error('Description should be string');
        if (!Array.isArray(symptoms)) throw new Error('Symptoms should be array');
        if (!Array.isArray(organs)) throw new Error('Organs should be array');

        this.id = id;
        this.name = name;
        this.description = description;
        this.symptoms = symptoms;
        this.organs = organs;
    }

    /**
     * Convert the Specialization object to a string representation.
     * @returns {string} A string representation of the specialization.
     */
    toString() {
        return `Specialization: "${this.name}".
        Description: ${this.description}.`;
    }

    /**
     * Create an array of Specialization objects from database rows.
     * @param {Array} rows - The rows of specialization data from the database.
     * @returns {Promise<Array<Specialization>>} A promise that resolves to an array of Specialization objects.
     */
    static async getSpecializationsFromData(rows) {
        if (rows.length == 0) { return []; }
        const symptoms = await Symptom.getSymptoms();
        const organs = await Organ.getOrgans();
        const toSymptomsQuery = await query(`SELECT * FROM specializations_to_symptoms;`);
        const toOrgansQuery = await query(`SELECT * FROM specializations_to_organs;`);

        const specializations = [];
        for (let row of rows) {
            let specialization = new Specialization(row.specialization_name, row.specialization_description, [], [], row.specialization_id);

            let specializationSymptoms = toSymptomsQuery.rows
                .filter(rec => rec.specialization_id == specialization.id)
                .map(rec => symptoms.find(symptom => symptom.id == rec.symptom_id));
            specialization.symptoms.push(...specializationSymptoms);

            let specializationOrgans = toOrgansQuery.rows
                .filter(rec => rec.specialization_id == specialization.id)
                .map(rec => organs.find(organ => organ.id == rec.organ_id));
            specialization.organs.push(...specializationOrgans);

            specializations.push(specialization);
        }
        return specializations;
    }

    /**
     * Get all specializations from the database.
     * @returns {Promise<Array<Specialization>>} A promise that resolves to an array of Specialization objects.
     */
    static async getSpecializations() {
        const res = await query(`SELECT * FROM specializations;`);
        return await Specialization.getSpecializationsFromData(res.rows);
    }

    /**
     * Get specializations by their IDs from the database.
     * @param {...number} id - The IDs of the specializations.
     * @returns {Promise<Array<Specialization>>} A promise that resolves to an array of Specialization objects.
     */
    static async getSpecializationsById(...id) {
        const res = await query(`SELECT * FROM specializations 
            WHERE specialization_id IN (${id.toString()});`);
        return await Specialization.getSpecializationsFromData(res.rows);
    }

    /**
     * Insert the current Specialization object into the database.
     * @returns {Promise<void>} A promise that resolves when the specialization is inserted.
     */
    async insertSpecialization() {
        const res = await query(`INSERT INTO specializations(
	        specialization_name, specialization_description)
            VALUES ('${this.name}', '${this.description}') RETURNING *;`);
        this.id = res.rows[0].specialization_id;
        console.log('Inserted:', res.rows[0]);
    }

    /**
     * Delete the current Specialization object from the database.
     * @returns {Promise<void>} A promise that resolves when the specialization is deleted.
     */
    async deleteSpecialization() {
        const res = await query(`DELETE FROM specializations WHERE specialization_id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Specialization };
