const { Specialization } = require("./Specialization");
const { User } = require("./User");
const { Role } = require("./Role");
const { query } = require("../config/database");

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
     * @param {Date|null} workdayStart - Start time of the workday.
     * @param {Date|null} workdayEnd - End time of the workday.
     */
    constructor(user, specialization, patientLoad = 1, workdayStart = null, workdayEnd = null) {
        // if (user.age <= 18 || user.age > 70)
        //     throw new Error('Doctor\'s age should be from 18 to 70.');

        // if (typeof patientLoad !== 'number' || patientLoad < 0)
        //     throw new Error('Patient load is not valid.');

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
     * @returns {Doctor[]} - Array of Doctor objects.
     */
    static async getDoctorsFromData(rows) {
        if (rows.length === 0) { return []; }
        const doctors = rows.map(async row => {
            const user = (await User.getUsersFromData(rows))[0];
            const doctor = new Doctor(user, null, row.patient_load, row.workday_start, row.workday_end);
            doctor.specialization = (await Specialization.getSpecializationsById(row.specialization_id))[0];
            return doctor;
        });
        return Promise.all(doctors);
    }

    /**
     * Static method to fetch all doctors from the database.
     * @returns {Doctor[]} - Array of Doctor objects.
     */
    static async getDoctors() {
        const res = await query(`SELECT * FROM doctors 
            INNER JOIN users ON
	        users.user_id=doctors.user_id;`);
        return await Doctor.getDoctorsFromData(res.rows);
    }

    /**
     * Static method to fetch doctors by their user IDs.
     * @param {...number} id - User IDs of doctors to fetch.
     * @returns {Doctor[]} - Array of Doctor objects.
     */
    static async getDoctorsById(...ids) {
        const idArr = ids.map(id => `'${id}'`).join(',');
        const res = await query(`SELECT * FROM doctors
            INNER JOIN users ON
	        users.user_id=doctors.user_id
            WHERE doctors.user_id IN (${idArr});`);
        return Doctor.getDoctorsFromData(res.rows);
    }

    /**
     * Method to insert the doctor into the database.
     */
    async insertDoctor() {
        const res = await query(`INSERT INTO doctors (
            specialization_id, workday_start, workday_end, user_id, patient_load)
            VALUES (${this.specialization.id}, '${this.workdayStart}',
            '${this.workdayEnd}', '${this.user.id}', ${this.patientLoad}) RETURNING *;`);
        this.id = res.rows[0].user_id; // Assuming 'user_id' is returned from database upon insertion
        console.log('Inserted:', res.rows[0]);
    }

    /**
     * Method to delete the doctor from the database.
     */
    async deleteDoctor() {
        const res = await query(`DELETE FROM doctors WHERE user_id = '${this.user.id}' RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Doctor };
