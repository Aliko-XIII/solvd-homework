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
        if (rows.length == 0) return [];

        const specializations = rows.map(row => {

            const specialization = new Specialization(row.specialization_name, row.specialization_description,
                row.symptoms, row.organs, row.specialization_id);
            if (specialization.symptoms[0] == null) {
                specialization.symptoms = [];
            }
            if (specialization.organs[0] == null) {
                specialization.organs = [];
            }
            return specialization;
        }
        );

        return specializations;
    }

    /**
     * Get all specializations from the database using joins.
     * @returns {Promise<Array<Specialization>>} A promise that resolves to an array of Specialization objects.
     */
    static async getSpecializations(nestOrgans = false, nestSymptoms = false) {
        let queryStr = `SELECT s.specialization_id, s.specialization_name, s.specialization_description,\n`;

        queryStr += !nestSymptoms
            ? `ARRAY_AGG(DISTINCT sy.symptom_id) AS symptoms,\n`
            : `COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', sy.symptom_id,
                    'name', sy.symptom_name, 'description', sy.symptom_description))
                    FILTER (WHERE sy.symptom_id IS NOT NULL), '[]') AS symptoms,\n`;

        queryStr += !nestOrgans
            ? `ARRAY_AGG(DISTINCT o.organ_id) AS organs\n`
            : `COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', o.organ_id,
                    'name', o.organ_name, 'description', o.organ_description))
                    FILTER (WHERE o.organ_id IS NOT NULL), '[]') AS organs\n`;

        queryStr += `FROM specializations s
                LEFT JOIN specializations_to_symptoms sts ON s.specialization_id = sts.specialization_id
                LEFT JOIN specializations_to_organs sto ON s.specialization_id = sto.specialization_id
                LEFT JOIN symptoms sy ON sts.symptom_id = sy.symptom_id
                LEFT JOIN organs o ON sto.organ_id = o.organ_id
                GROUP BY s.specialization_id;`;

        const res = await query(queryStr);
        const specializations = Specialization.getSpecializationsFromData(res.rows);
        return specializations;
    }


    /**
     * Get specializations by their IDs from the database.
     * @param {...number} id - The IDs of the specializations.
     * @returns {Promise<Array<Specialization>>} A promise that resolves to an array of Specialization objects.
     */
    static async getSpecializationsById(...id) {
        const res = await query(`
            SELECT s.specialization_id, s.specialization_name, s.specialization_description,
            ARRAY_AGG(DISTINCT sy.symptom_id) AS symptoms,
            ARRAY_AGG(DISTINCT o.organ_id) AS organs
            FROM specializations s
            LEFT JOIN specializations_to_symptoms sts ON s.specialization_id = sts.specialization_id
            LEFT JOIN specializations_to_organs sto ON s.specialization_id = sto.specialization_id
            LEFT JOIN symptoms sy ON sts.symptom_id = sy.symptom_id
            LEFT JOIN organs o ON sto.organ_id = o.organ_id
            WHERE s.specialization_id IN(${id.toString()})
            GROUP BY s.specialization_id;
        `);
        return await Specialization.getSpecializationsFromData(res.rows);
    }

    /**
     * Insert the current Specialization object into the database.
     * @returns {Promise<void>} A promise that resolves when the specialization is inserted.
     */
    async insertSpecialization() {
        try {
            const res = await query(`INSERT INTO specializations(
                specialization_name, specialization_description)
            VALUES('${this.name}', '${this.description}') RETURNING *;`);
            
            this.id = res.rows[0].specialization_id;
    
            // Insert into specializations_to_symptoms
            for (const symptom of this.symptoms) {
                await query(`INSERT INTO specializations_to_symptoms(
                    specialization_id, symptom_id)
                VALUES(${this.id}, ${symptom.id});`);
            }
    
            // Insert into specializations_to_organs
            for (const organ of this.organs) {
                await query(`INSERT INTO specializations_to_organs(
                    specialization_id, organ_id)
                VALUES(${this.id}, ${organ.id});`);
            }
    
            console.log('Inserted:', res.rows[0]);
        } catch (err) {
            console.error('Error inserting specialization:', err);
            throw err;
        }
    }

    /**
     * Delete the current Specialization object from the database.
     * @returns {Promise<void>} A promise that resolves when the specialization is deleted.
     */
    async deleteSpecialization() {
        const res = await query(`DELETE FROM specializations WHERE specialization_id = ${this.id} RETURNING *; `);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Specialization };
