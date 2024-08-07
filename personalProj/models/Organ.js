const { query } = require("../config/database");

/**
 * Class representing treated organs.
 */
class Organ {
    /**
     * Create an Organ.
     * @param {string} name - The name of the organ.
     * @param {string} description - A description of the organ.
     * @param {number} [id=-1] - The ID of the organ (optional).
     */
    constructor(name, description, id = -1) {
        if (typeof name !== 'string') throw new Error('Name should be string');
        if (typeof description !== 'string') throw new Error('Description should be string');

        this.id = id;
        this.name = name;
        this.description = description;
    }

    /**
     * Convert the Organ object to a string representation.
     * @returns {string} A string representation of the organ.
     */
    toString() {
        return `Organ "${this.name}"
        Description: ${this.description.length == 0 ? 'Empty.' : this.description}`;
    }

    /**
     * Create an array of Organ objects from database rows.
     * @param {Array} rows - The rows of organ data from the database.
     * @returns {Array<Organ>} An array of Organ objects.
     */
    static async getOrgansFromData(rows) {
        return rows.map(row => new Organ(row.organ_name, row.organ_description, row.organ_id));
    }

    /**
     * Get all organs from the database.
     * @returns {Promise<Array<Organ>>} A promise that resolves to an array of Organ objects.
     */
    static async getOrgans(filters = {}) {
        const res = await query(`SELECT * FROM organs;`);
        const conditions = [];
        if (filters.name) {
            conditions.push(`organ_name ILIKE '%${filters.name}%'`);
        }
        if (filters.description) {
            conditions.push(`organ_description ILIKE '%${filters.description}%'`);
        }

        if (conditions.length > 0) {
            queryStr += ` WHERE ${conditions.join(' AND ')}`;
        }
        return await this.getOrgansFromData(res.rows);
    }

    /**
     * Get organs by their IDs from the database.
     * @param {...number} id - The IDs of the organs.
     * @returns {Promise<Array<Organ>>} A promise that resolves to an array of Organ objects.
     */
    static async getOrgansByIds(...id) {
        const res = await query(`SELECT * FROM organs 
            WHERE organ_id IN (${id.toString()});`);
        return await this.getOrgansFromData(res.rows);
    }

    /**
     * Get an organ by its ID from the database.
     * @param {number} id - The ID of the organ.
     * @returns {Promise<Organ|null>} A promise that resolves to an Organ object or null if not found.
     */
    static async getOrganById(id) {
        return (await Organ.getOrgansByIds(id))[0];
    }

    /**
     * Insert the current Organ object into the database.
     * @returns {Promise<void>} A promise that resolves when the organ is inserted.
     */
    async insertOrgan() {
        const res = await query(`INSERT INTO organs(
	        organ_name, organ_description)
            VALUES ('${this.name}', '${this.description}') RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
    }

    /**
     * Updates an organ's information in the database.
     * 
     * @param {number} id - The organ ID.
     * @param {Object} updates - The fields to update.
     * @param {string} [updates.name] - The new name.
     * @param {string} [updates.description] - The new description.
     * @throws {Error} If no ID is provided or no parameters to update.
     */
    static async updateOrgan(id, { name, description }) {
        if (!id) throw new Error('There is no id passed to update organ record.');
        const hasParams = Object.keys({ name, description })
            .some(key => key !== undefined);
        if (!hasParams) throw new Error('There are no params to update.');

        let queryStr = `UPDATE organs SET\n`;
        queryStr += `${name ? `organ_name = '${name}', ` : ''}`;
        queryStr += `${description ? `organ_description = '${description}', ` : ''}`;

        queryStr = queryStr.slice(0, -2) + ' ';
        queryStr += `WHERE organ_id=${id};`;
        console.log(queryStr);
        const res = await query(queryStr);
        console.log('Updated:', res.rows[0]);
    }

    /**
     * Delete the current Organ object from the database.
     * @returns {Promise<void>} A promise that resolves when the organ is deleted.
     */
    async deleteOrgan() {
        const res = await query(`DELETE FROM organs WHERE organ_id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Organ };
