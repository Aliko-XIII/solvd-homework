const { Specialization } = require('./Specialization');
const { User } = require('./User');
const { Role } = require('./Role');
const { query } = require('../config/database');

/**
 * Class representing a hospital's doctor.
 * @extends Role
 */
class Doctor extends Role {
    /**
     * Doctor's specialization.
     * @type {Specialization}
     */
    specialization;

    /**
     * Time when doctor starts work.
     * @type {Date|null}
     */
    workdayStart;

    /**
     * Time when doctor ends work.
     * @type {Date|null}
     */
    workdayEnd;

    /** 
     * Maximum number of patients the doctor can handle per day.
     * @type {number}
     */
    patientLoad;

    /**
     * Constructor for Doctor class.
     * @param {User} user - The user associated with the doctor.
     * @param {Specialization} specialization - Doctor's specialization object.
     * @param {number} patientLoad - Maximum number of patients per day for the doctor.
     * @param {string|null} workdayStart - Start time of the workday.
     * @param {string|null} workdayEnd - End time of the workday.
     */
    constructor(user, specialization, patientLoad = 1, workdayStart = null, workdayEnd = null) {
        if (!specialization) throw new Error('Doctor\'s specialization should be set.');
        if (typeof patientLoad !== 'number' || patientLoad < 0)
            throw new Error('Patient load is not valid.');

        super(user);
        this.specialization = specialization;
        this.patientLoad = patientLoad;
        this.workdayStart = workdayStart;
        this.workdayEnd = workdayEnd;
    }

    /**
     * Getter for doctor's specialization.
     * @returns {Specialization}
     */
    getSpecialization() {
        return this.specialization;
    }

    /**
     * Static method to fetch doctors from database rows.
     * @param {Object[]} rows - Rows fetched from the database.
     * @param {boolean} nestUser - Whether to include nested user records.
     * @param {boolean} nestSpecialization - Whether to include nested specialization records.
     * @returns {Promise<Doctor[]>} A promise that resolves to an array of Doctor objects.
     */
    static async getDoctorsFromData(rows, nestUser = false, nestSpecialization = false) {
        if (rows.length === 0) return [];
        const doctors = rows.map(async row => {
            let user = nestUser ? (await User.getUsersFromData([row]))[0] :
                { id: row.user_id };
            let specialization = nestSpecialization ? (await Specialization
                .getSpecializationsByIds([row.specialization_id]))[0] :
                { id: row.specialization_id };
            const doctor = new Doctor(user, specialization, row.patient_load,
                row.workday_start, row.workday_end);
            return doctor;
        });
        return Promise.all(doctors);
    }

    /**
     * Retrieves all doctors from the database with optional nesting.
     * @param {number} [specializationId] - What specialization id should doctors have.
     * @param {boolean} [nestUser=false] - Whether to include nested user records.
     * @param {boolean} [nestSpecialization=false] - Whether to include nested specialization records.
     * @returns {Promise<Doctor[]>} A promise that resolves to an array of Doctor instances.
     */
    static async getDoctors({ specializationId, nestUser, nestSpecialization } = {}) {
        let queryStr = `SELECT doctors.user_id, specialization_id, patient_load, workday_start,
            workday_end, first_name, last_name, age, sex, pass, phone FROM doctors 
        INNER JOIN users ON users.user_id = doctors.user_id`;
        queryStr += specializationId ? `WHERE specialization_id=${specializationId};` : ';';
        const res = await query(queryStr);
        return await Doctor.getDoctorsFromData(res.rows, nestUser, nestSpecialization);
    }


    /**
     * Static method to fetch doctors by their user IDs.
     * @param {boolean} [nestUser=false] - Whether to include nested user records.
     * @param {boolean} [nestSpecialization=false] - Whether to include nested specialization records.
     * @param {number[]} ids - User IDs of doctors to fetch.
     * @returns {Promise<Doctor[]>} A promise that resolves to an array of Doctor objects.
     */
    static async getDoctorsByIds(ids, nestUser = false, nestSpecialization = false) {
        const idArr = ids.map(id => `'${id}'`).join(',');
        const res = await query(`SELECT doctors.user_id, specialization_id, patient_load, workday_start,
            workday_end, first_name, last_name, age, sex, pass, phone FROM doctors
        INNER JOIN users ON users.user_id = doctors.user_id
        WHERE doctors.user_id IN (${idArr});`);
        return await Doctor.getDoctorsFromData(res.rows, nestUser, nestSpecialization);
    }

    /**
     * Method to insert the doctor into the database.
     */
    async insertDoctor() {
        const res = await query(`INSERT INTO doctors (
            specialization_id, workday_start, workday_end, user_id, patient_load)
            VALUES (${this.specialization.id}, '${this.workdayStart}',
            '${this.workdayEnd}', '${this.user.id}', ${this.patientLoad}) RETURNING *;`);
        this.id = res.rows[0].user_id;
        return { id: this.id };
    }

    /**
     * Updates a doctor's information in the database.
     * @param {string} id - The doctor ID.
     * @param {Object} updates - The fields to update.
     * @param {number} [updates.specialization_id] - The new specialization ID.
     * @param {number} [updates.patientLoad] - The new maximum number of patients per day.
     * @param {Date|null} [updates.workdayStart] - The new start time of the workday.
     * @param {Date|null} [updates.workdayEnd] - The new end time of the workday.
     * @throws {Error} If no ID is provided or no parameters to update.
     * @returns {Promise<void>} A promise that resolves when the doctor is updated.
     */
    static async updateDoctor(id, { specializationId, patientLoad, workdayStart, workdayEnd }) {
        if (!id) throw new Error('No ID provided to update doctor record.');
        const hasParams = Object.values(
            { specializationId, patientLoad, workdayStart, workdayEnd })
            .some(value => value !== undefined);
        if (!hasParams) throw new Error('No parameters to update.');

        let queryStr = `UPDATE doctors SET `;
        const updates = [];
        if (specializationId) updates.push(`specialization_id = ${specializationId}`);
        if (patientLoad) updates.push(`patient_load = ${patientLoad}`);
        if (workdayStart) updates.push(`workday_start = '${workdayStart}'`);
        if (workdayEnd) updates.push(`workday_end = '${workdayEnd}'`);
        if (updates.length > 0) queryStr += ` ${updates.join(', ')} `;
        queryStr += ` WHERE user_id = '${id}' RETURNING *;`;

        const res = await query(queryStr);
        const updated = (await Doctor.getDoctorsFromData(res.rows))[0];
        return updated;
    }


    /**
     * Method to delete the doctor from the database.
     */
    async deleteDoctor() {
        await query(`DELETE FROM doctors WHERE user_id = '${this.user.id}' RETURNING *;`);
    }
}

module.exports = { Doctor };
