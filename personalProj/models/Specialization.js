const { Symptom } = require("./Symptom");
const { Organ } = require("./Organ");
const { client } = require("../config/database");

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
    constructor(id, name, description = '', symptoms = [], organs = []) {
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

    static async getSpecializations() {
        try {
            const symptoms = await Symptom.getSymptoms();
            const organs = await Organ.getOrgans();
            const toSymptomsQuery = await client.query(`SELECT * FROM specializations_to_symptoms;`);
            const toOrgansQuery = await client.query(`SELECT * FROM specializations_to_organs;`);
            const query = await client.query(`SELECT * FROM specializations;`);

            const specializations = [];
            for (let row of query.rows) {
                let specialization = new Specialization(row.id, row.name, row.description);

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
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

    static async getSpecializationsById(...id) {
        try {
            const symptoms = await Symptom.getSymptoms();
            const organs = await Organ.getOrgans();
            const toSymptomsQuery = await client.query(`SELECT * FROM specializations_to_symptoms;`);
            const toOrgansQuery = await client.query(`SELECT * FROM specializations_to_organs;`);
            const query = await client.query(`SELECT * FROM specializations WHERE id IN (${id.toString()});`);

            const specializations = [];
            for (let row of query.rows) {
                let specialization = new Specialization(row.id, row.name, row.description);

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
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

}

// Specialization.getSpecializationsById(3).then(val=>console.log(val[0]));

module.exports = { Specialization };