const { Specialization } = require("./Specialization");
const { User } = require("./User");
const { Role } = require("./Role");
const { client } = require("../config/database");
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

    static async getDoctors() {
        try {
            const res = await client.query(`SELECT * FROM doctors
                INNER JOIN users 
                ON users.id = doctors.user_id;`);
            return res.rows;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

    /**
     * 
     * @returns {Doctor[]}
     */
    static async getDoctors() {
        try {
            const res = await client.query(`SELECT * FROM doctors;`);
            const doctors = [];
            const users = await User.getUsersById(...res.rows.map(row => row.user_id));
            for (let user of users) {
                let userRow = res.rows.find(row => row.user_id == user.id);
                if (!userRow) { continue; }
                let doctor = new Doctor(user, null, userRow.max_load);
                doctor.availableFrom = userRow.available_from;
                doctor.availableTill = userRow.available_till;
                const specialization = (await Specialization.getSpecializationsById(userRow.specialization))[0];
                doctor.specialization = specialization;
                console.log(specialization);
                doctors.push(doctor);
            }
            return doctors;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }

}

Doctor.getDoctors().then(console.log)
module.exports = { Doctor };