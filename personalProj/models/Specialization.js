const { Symptom } = require("./Symptom");
const { Organ } = require("./Organ");
const { query } = require("../config/database");

/**
 * Class representing doctors' specializations.
 */
class Specialization {
    /**
     * Constructor for Specialization class.
     * @param {string} name - name of doctor's specialization
     * @param {string} description - description of doctor's specialization
     * @param {Symptom[]} symptoms - symptoms treated with doctor's specialization
     * @param {Organ[]} organs - organs treated with doctor's specialization
     */
    constructor(name, description = '', symptoms = [], organs = [], id = -1) {
        this.id = id;

        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name;

        if (typeof description !== 'string') {
            throw new Error('Description should be string');
        }
        this.description = description;

        if (!Array.isArray(symptoms)) {
            throw new Error('Symptoms should be array');
        }
        this.symptoms = symptoms;

        if (!Array.isArray(organs)) {
            throw new Error('Organs should be array');
        }
        this.organs = organs;
    }

    toString() {
        return `Specialization: "${this.name}".
        Description: ${this.description}.`;
    }

    static async getSpecializationsFromData(rows) {
        if (rows.length == 0) { return []; }
        const symptoms = await Symptom.getSymptoms();
        const organs = await Organ.getOrgans();
        const toSymptomsQuery = await query(`SELECT * FROM specializations_to_symptoms;`);
        const toOrgansQuery = await query(`SELECT * FROM specializations_to_organs;`);

        const specializations = [];
        for (let row of rows) {
            let specialization = new Specialization(row.name, row.description, [], [], row.id);

            let specializationSymptoms = toSymptomsQuery.rows
                .filter(rec => rec.specialization == specialization.id)
                .map(rec => symptoms.find(symptom => symptom.id == rec.symptom));
            specialization.symptoms.push(...specializationSymptoms);

            let specializationOrgans = toOrgansQuery.rows
                .filter(rec => rec.specialization == specialization.id)
                .map(rec => organs.find(organ => organ.id == rec.organ));
            specialization.organs.push(...specializationOrgans);

            specializations.push(specialization);
        }
        return specializations;
    }

    static async getSpecializations() {
        const res = await query(`SELECT * FROM specializations;`);
        return await Specialization.getSpecializationsFromData(res.rows);
    }

    static async getSpecializationsById(...id) {
        const res = await query(`SELECT * FROM specializations 
            WHERE id IN (${id.toString()});`);
        return await Specialization.getSpecializationsFromData(res.rows);
    }

    async insertSpecialization() {
        const res = await query(`INSERT INTO specializations(
	        name, description)
            VALUES ('${this.name}', '${this.description}') RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
    }

    async deleteSpecialization() {
        const res = await query(`DELETE FROM specializations WHERE id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }

}


module.exports = { Specialization };