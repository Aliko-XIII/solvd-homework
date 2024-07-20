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
     * @type {Date}
     */
    workdayStart;

    /**
     * Time when doctor ends work.
     * @type {Date}
     */
    workdayEnd;

    /** 
     * Maximum number of patients the doctor can handle per day.
     * @type {number}
     */
    maxLoad;

    /**
     * Constructor for Doctor class.
     * @param {User} user - The user associated with the doctor.
     * @param {Specialization} specialization - Doctor's specialization object.
     * @param {number} maxLoad - Maximum number of patients per day for the doctor.
     */
    constructor(user, specialization, maxLoad = 1) {
        if (user.age <= 18 || user.age > 70)
            throw new Error('Doctor\'s age should be from 18 to 70.');
        // if (!(specialization instanceof Specialization))
        //     throw new Error('Wrong specialization data type.');
        if (typeof maxLoad !== 'number' || maxLoad < 0)
            throw new Error('Max patient load is not valid.');

        super(user);
        this.specialization = specialization;
        this.maxLoad = maxLoad;
        this.workdayStart = null;
        this.workdayEnd = null;
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
            const doctor = new Doctor(user, null, row.max_load);
            doctor.workdayStart = row.workday_start;
            doctor.workdayEnd = row.workday_end;
            doctor.specialization = (await Specialization.
                getSpecializationsById(row.specialization_id))[0];
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
        const res = await query(`INSERT INTO public.doctors (
            specialization_id, workday_start, workday_end, user_id, max_load)
            VALUES (${this.specialization.id}, '${this.workdayStart}',
            '${this.workdayEnd}', ${this.user.id}, ${this.maxLoad}) RETURNING *;`);
        this.id = res.rows[0].id; // Assuming 'id' is returned from database upon insertion
        console.log('Inserted:', res.rows[0]);
    }

    /**
     * Method to delete the doctor from the database.
     */
    async deleteDoctor() {
        const res = await query(`DELETE FROM doctors WHERE user_id = ${this.user.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

module.exports = { Doctor };
