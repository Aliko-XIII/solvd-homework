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
    constructor(insuranceNumber, insuranceProvider, user) {
        if (typeof insuranceNumber != 'string') throw new Error('Insurance number is not valid.');
        if (typeof insuranceProvider != 'string') throw new Error('Insurance provider is not valid.');

        super(user);
        this.insuranceNumber = insuranceNumber;
        this.insuranceProvider = insuranceProvider;
    }

    /**
     * Transforms database rows into Patient instances.
     * @param {Object[]} rows - The rows returned from the database query.
     * @returns {Promise<Patient[]>} A promise that resolves to an array of Patient instances.
     */
    static async getPatientsFromData(rows) {
            console.log(rows);
            const patients = rows.map(async row => {
            const user = (await User.getUsersFromData(rows))[0];
            const patient = new Patient(row.insurance_number, row.insurance_provider, user);
            return patient;
        });
        return Promise.all(patients);
    }

    /**
     * Retrieves all patients from the database.
     * @returns {Promise<Patient[]>} A promise that resolves to an array of Patient instances.
     */
    static async getPatients() {
        const res = await query(`SELECT * FROM patients
            INNER JOIN users ON
	        users.user_id=patients.user_id;`);
        return await this.getPatientsFromData(res.rows);
    }

    /**
     * Retrieves a patient by ID from the database.
     * @param {string} id - The patient ID.
     * @returns {Promise<Patient>} A promise that resolves to a Patient instance.
     */
    static async getPatientById(id) {
        const res = await query(`SELECT * FROM patients
            INNER JOIN users ON
	        users.user_id=patients.user_id
            WHERE patients.user_id = '${id}';`);
        console.log(res.rows);
        return (await Patient.getPatientsFromData(res.rows))[0];
    }

    /**
     * Retrieves multiple patients by their IDs from the database.
     * @param {...string} ids - The patient IDs.
     * @returns {Promise<Patient[]>} A promise that resolves to an array of Patient instances.
     */
    static async getPatientsByIds(...ids) {
        const idArr = ids.map(id => `'${id}'`).join(',');
        const res = await query(`SELECT * FROM patients 
            INNER JOIN users ON
	        users.user_id=patients.user_id
            WHERE patients.user_id IN (${idArr}) ;`);
        return await Patient.getPatientsFromData(res.rows);
    }

    /**
     * Inserts the current Patient instance into the database.
     * @returns {Promise<void>} A promise that resolves when the patient is inserted.
     */
    async insertPatient() {
        const res = await query(`INSERT INTO patients(insurance_number, insurance_provider, user_id)
            VALUES ('${this.insuranceNumber}', '${this.insuranceProvider}', '${this.user.id}')
            RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
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
    async updatePatient(id, { insuranceNumber, insuranceProvider }) {
        if (!id) throw new Error('No ID provided to update patient record.');
        const hasParams = Object.keys({ insuranceNumber, insuranceProvider })
            .some(key => key !== undefined);
        if (!hasParams) throw new Error('No parameters to update.');

        let queryStr = `UPDATE patients SET\n`;
        queryStr += `${insuranceNumber ? `insurance_number = '${insuranceNumber}', ` : ''}
            ${insuranceProvider ? `insurance_provider = '${insuranceProvider}', ` : ''}`;
        queryStr = queryStr.slice(0, -2) + '\n';
        queryStr += `WHERE user_id = '${id}';`;

        const res = await query(queryStr);
        console.log('Updated:', res.rows[0]);
    }

    /**
     * Deletes the current Patient instance from the database.
     * @returns {Promise<void>} A promise that resolves when the patient is deleted.
     */
    static async deletePatient(id) {
        const res = await query(`DELETE FROM patients 
            WHERE user_id = '${id}' RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Patient };
