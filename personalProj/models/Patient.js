const { User } = require("./User");
const { Role } = require("./Role");
const { query } = require("../config/database");

/**
 * Class representing a hospital's patient.
 * @extends Role
 */
class Patient extends Role {
    /**
     * Creates an instance of Patient.
     * @param {string} insuranceNumber - The patient's insurance number.
     * @param {string} insuranceProvider - The patient's insurance provider.
     * @param {User} user - The patient's user record.
     */
    constructor(user, insuranceNumber, insuranceProvider) {
        super(user);
        if (!this.validateString(insuranceNumber)) throw new Error('Insurance number is not valid.');
        if (!this.validateString(insuranceProvider)) throw new Error('Insurance provider is not valid.');

        this.insuranceNumber = insuranceNumber;
        this.insuranceProvider = insuranceProvider;
    }

    /**
     * Validates that the input value is a non-empty string.
     * 
     * @param {string} value - The value to validate.
     * @returns {boolean} - Returns true if the value is a non-empty string, otherwise false.
     */
    validateString(value) {
        return typeof value === 'string' && value.length > 0;
    }

    /**
     * Transforms database rows into Patient instances.
     * @param {Object[]} rows - The rows returned from the database query.
     * @param {boolean} nestUser - Whether to include nested user records.
     * @returns {Promise<Patient[]>} A promise that resolves to an array of Patient instances.
     */
    static async getPatientsFromData(rows, nestUser = false) {
        const patients = rows.map(async row => {
            const user = nestUser ?
                (await User.getUsersFromData([row]))[0] :
                { id: row.user_id };
            const patient = new Patient(user,row.insurance_number, row.insurance_provider);
            return patient;
        });
        return Promise.all(patients);
    }

    /**
     * Retrieves all patients from the database with optional filtering.
     * @param {Object} filters - The filters to apply.
     * @param {string} [filters.insuranceNumber] - Part of the patient's insurance number.
     * @param {string} [filters.insuranceProvider] - Part of the patient's insurance provider name.
     * @param {boolean} [filters.nestUser] - Whether to include nested user records.
     * @returns {Promise<Patient[]>} A promise that resolves to an array of Patient instances.
     */
    static async getPatients({ insuranceNumber, insuranceProvider, nestUser } = {}) {
        let queryStr = `
            SELECT patients.user_id, insurance_number, insurance_provider,
            first_name, last_name, age, sex, pass, phone 
            FROM patients 
            INNER JOIN users ON users.user_id = patients.user_id
        `;

        const conditions = [];
        if (insuranceNumber) conditions.push(`insurance_number LIKE '%${insuranceNumber}%'`);
        if (insuranceProvider) conditions.push(`insurance_provider LIKE '%${insuranceProvider}%'`);

        if (conditions.length > 0) {
            queryStr += ` WHERE ${conditions.join(' AND ')}`;
        }

        const res = await query(queryStr);
        return await this.getPatientsFromData(res.rows, nestUser);
    }

    /**
     * Retrieves a patient by ID from the database.
     * @param {string} id - The patient ID.
     * @param {boolean} nestUser - Whether to include nested user records.
     * @returns {Promise<Patient>} A promise that resolves to a Patient instance.
     */
    static async getPatientById(id, nestUser = false) {
        return (await Patient.getPatientsByIds([id], nestUser))[0];
    }

    /**
     * Retrieves multiple patients by their IDs from the database.
     * @param {boolean} nestUser - Whether to include nested user records.
     * @param {string[]} ids - The patient IDs.
     * @returns {Promise<Patient[]>} A promise that resolves to an array of Patient instances.
     */
    static async getPatientsByIds(ids, nestUser = false) {
        const idArr = ids.map(id => `'${id}'`).join(',');
        const res = await query(`SELECT patients.user_id, insurance_number, insurance_provider,
            first_name, last_name, age, sex, pass, phone FROM patients 
            INNER JOIN users ON users.user_id=patients.user_id
            WHERE patients.user_id IN (${idArr});`);
        return await Patient.getPatientsFromData(res.rows, nestUser);
    }

    /**
     * Inserts the current Patient instance into the database.
     * @returns {Promise<void>} A promise that resolves when the patient is inserted.
     */
    async insertPatient() {
        const res = await query(`INSERT INTO patients(insurance_number, insurance_provider, user_id)
            VALUES ('${this.insuranceNumber}', '${this.insuranceProvider}', '${this.user.id}')
            RETURNING *;`);
        this.id = res.rows[0].user_id;
        console.log('Inserted:', res.rows[0]);
        return { id: this.id };
    }

    /**
     * Updates a patient's information in the database.
     * @param {string} id - The patient ID.
     * @param {Object} updates - The fields to update.
     * @param {string} [updates.insuranceNumber] - The new insurance number.
     * @param {string} [updates.insuranceProvider] - The new insurance provider.
     * @throws {Error} If no ID is provided or no parameters to update.
     * @returns {Promise<void>} A promise that resolves when the patient is updated.
     */
    static async updatePatient(id, { insuranceNumber, insuranceProvider }) {
        if (!id) throw new Error('No ID provided to update patient record.');
        const hasParams = Object.keys({ insuranceNumber, insuranceProvider })
            .some(key => key !== undefined);
        if (!hasParams) throw new Error('No parameters to update.');

        let queryStr = `UPDATE patients SET `;
        const updates = [];
        if (insuranceNumber) updates.push(`insurance_number = '${insuranceNumber}'`);
        if (insuranceProvider) updates.push(`insurance_provider = '${insuranceProvider}'`);
        if (updates.length > 0) {
            queryStr += ` ${updates.join(', ')} `;
        }
        queryStr += ` WHERE user_id = '${id}' RETURNING *;`;
        const res = await query(queryStr);
        console.log('Updated:', res.rows[0]);
        const updated = (await this.getPatientsFromData(res.rows))[0];
        return updated;

    }

    /**
     * Deletes a patient by ID from the database.
     * @param {string} id - The patient ID.
     * @returns {Promise<void>} A promise that resolves when the patient is deleted.
     */
    async deletePatient() {
        const res = await query(`DELETE FROM patients WHERE user_id = '${this.user.id}' RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Patient };
