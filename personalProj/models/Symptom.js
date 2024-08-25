const { query } = require("../config/database");

/**
 * Class representing patients' symptoms.
 */
class Symptom {
    /**
     * Create a Symptom.
     * @param {string} name - The name of the symptom.
     * @param {string} description - A description of the symptom.
     * @param {number} [id=-1] - The ID of the symptom (optional).
     */
    constructor(name, description, id = -1) {
        if (typeof name !== 'string') throw new Error('Name should be string');
        if (typeof description !== 'string') throw new Error('Description should be string');

        this.id = id;
        this.name = name;
        this.description = description;
    }

    /**
     * Convert the Symptom object to a string representation.
     * @returns {string} A string representation of the symptom.
     */
    toString() {
        return `Symptom "${this.name}"
        Description: ${this.description.length === 0 ? 'Empty.' : this.description}`;
    }

    /**
     * Create an array of Symptom objects from database rows.
     * @param {Array} rows - The rows of symptom data from the database.
     * @returns {Symptom[]} An array of Symptom objects.
     */
    static getSymptomsFromData(rows) {
        return rows.map(row =>
            new Symptom(row.symptom_name, row.symptom_description, row.symptom_id));
    }

    /**
     * Get all symptoms from the database.
     * @param {Object} filters - The filters to apply.
     * @param {string} [filters.name] - Part of the symptom's name.
     * @param {string} [filters.description] - Part of the symptom's description.
     * @returns {Promise<Symptom[]>} A promise that resolves to an array of Symptom objects.
     */
    static async getSymptoms({ name, description }) {
        let queryStr = `SELECT symptom_name, symptom_description, symptom_id FROM symptoms`;
        const conditions = [];

        if (name) conditions.push(`symptom_name ILIKE '%${name}%'`);
        if (description) conditions.push(`symptom_description ILIKE '%${description}%'`);
        if (conditions.length > 0) queryStr += ` WHERE ${conditions.join(' AND ')}`;

        const res = await query(queryStr);
        return this.getSymptomsFromData(res.rows);
    }

    /**
     * Get symptoms by their IDs from the database.
     * @param {number[]} id - The IDs of the symptoms.
     * @returns {Promise<Symptom[]>} A promise that resolves to an array of Symptom objects.
     */
    static async getSymptomsByIds([ids]) {
        const res = await query(`SELECT symptom_name, symptom_description, symptom_id
            FROM symptoms WHERE symptom_id IN (${ids.toString()});`);
        return this.getSymptomsFromData(res.rows);
    }

    /**
     * Get a symptom by its ID from the database.
     * @param {number} id - The ID of the symptom.
     * @returns {Promise<Symptom>} A promise that resolves to a Symptom object or null if not found.
     */
    static async getSymptomById(id) {
        return (await Symptom.getSymptomsByIds([id]))[0];
    }

    /**
     * Insert the current Symptom object into the database.
     * @returns {Promise<void>} A promise that resolves when the symptom is inserted.
     */
    async insertSymptom() {
        const res = await query(`INSERT INTO symptoms(symptom_name, symptom_description)
            VALUES ('${this.name}', '${this.description}') RETURNING *;`);
        this.id = res.rows[0].symptom_id;
        return { id: this.id };
    }

    /**
     * Updates a symptom's information in the database.
     * 
     * @param {number} id - The symptom ID.
     * @param {Object} updates - The fields to update.
     * @param {string} [updates.name] - The new name.
     * @param {string} [updates.description] - The new description.
     * @throws {Error} If no ID is provided or no parameters to update.
     */
    static async updateSymptom(id, { name, description }) {
        if (!id) throw new Error('There is no id passed to update symptom record.');
        const hasParams = Object.keys({ name, description }).some(key => key !== undefined);
        if (!hasParams) throw new Error('There are no params to update.');

        let queryStr = `UPDATE symptoms SET `;
        const updates = [];
        if (name) updates.push(`symptom_name = '${name}'`);
        if (description) updates.push(`symptom_description = '${description}'`);
        if (updates.length > 0) queryStr += ` ${updates.join(', ')} `;
        queryStr += `WHERE symptom_id = ${id} RETURNING *; `;

        const res = await query(queryStr);
        const updated = (Symptom.getSymptomsFromData(res.rows))[0];
        return updated;
    }

    /**
     * Delete the current Symptom object from the database.
     * @returns {Promise<void>} A promise that resolves when the symptom is deleted.
     */
    async deleteSymptom() {
        await query(`DELETE FROM symptoms WHERE symptom_id = ${this.id} RETURNING *;`);
    }
}

module.exports = { Symptom };
