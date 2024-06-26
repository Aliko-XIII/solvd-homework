const { Specialization } = require("./Specialization");
const { User } = require("./User");
const { Role } = require("./Role");
const { query } = require("../config/database");
const { Appointment } = require("./Appointment");
/**
 * Class representing hospital's doctor.
 */
class Doctor extends Role {
    /**
     * Doctor's specialization
     * @type {Specialization}
     */
    specialization;

    /**
     * Date when doctor becomes available
     * @type {Date|null}
     */
    availableFrom;

    /**
     * Date when doctor stops being avalibale
     * @type {Date|null}
     */
    availableTill;

    /**
     * Max patients per day for doctor
     * @type {number}
     */
    maxLoad;

    /**
     * Constructor for Doctor class.
     * @param {Specialization} specialization - doctor's specialization 
     * @param {number} maxLoad - max amount of patients per day for doctor
     * @param {User} user - doctor's user record
     */
    constructor(user, specialization = null, maxLoad = 1) {
        if (user.age <= 18 || user.age > 70) {
            throw new Error('Doctor\'s age should be from 18 to 70.')
        }
        super(user);

        if (typeof specialization !== 'object') {
            throw new Error('Wrong specialization data type.');
        }
        this.specialization = specialization;

        if (typeof maxLoad != 'number' || maxLoad < 0) {
            throw new Error('Max patient load is not valid.')
        }
        this.maxLoad = maxLoad;
        this.availableFrom = null;
        this.availableTill = null;
    }

    get specialization() {
        return this.specialization;
    }


    static async getDoctorsFromData(rows) {
        if (rows.length == 0) { return []; }
        const doctors = [];
        const users = await User.getUsersById(...rows.map(row => row.user_id));
        for (let user of users) {
            let userRow = rows.find(row => row.user_id == user.id);
            if (!userRow) { continue; }
            let doctor = new Doctor(user, null, userRow.max_load);
            doctor.availableFrom = userRow.available_from;
            doctor.availableTill = userRow.available_till;
            const specialization = (await Specialization.getSpecializationsById(
                userRow.specialization))[0];
            doctor.specialization = specialization;
            doctors.push(doctor);
        }
        return doctors;
    }
    /**
     * 
     * @returns {Doctor[]}
     */
    static async getDoctors() {
        const res = await query(`SELECT * FROM doctors;`);
        return await Doctor.getDoctorsFromData(res.rows);
    }

    /**
     * 
     * @returns {Doctor[]}
     */
    static async getDoctorsById(...id) {
        const res = await query(`SELECT * FROM doctors
            WHERE user_id IN (${id.toString()});`);
        return Doctor.getDoctorsFromData(res.rows);
    }

    async insertDoctor() {
        const res = await query(`INSERT INTO public.doctors(
            specialization, available_from, available_till, user_id, max_load)
            VALUES (${this.specialization.id}, '${this.availableFrom}',
            '${this.availableTill}', ${this.user.id}, ${this.maxLoad}) RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
    }

    async deleteDoctor() {
        const res = await query(`DELETE FROM doctors WHERE user_id = ${this.user.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }

    async getAppointments() {
        const res = await query(`SELECT * FROM appointments 
            WHERE doctor = ${this.id};`);
        return await Appointment.getAppointmentsFromData(res.rows);
    }

}


module.exports = { Doctor };