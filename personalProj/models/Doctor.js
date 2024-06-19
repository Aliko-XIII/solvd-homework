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
    #specialization;

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
    constructor(specialization = null, maxLoad = 1, user) {
        if (user.age <= 18 || user.age > 70) {
            throw new Error('Doctor\'s age should be from 18 to 70.')
        }
        super(user);

        if (typeof specialization !== 'object') {
            throw new Error('Wrong specialization data type.');
        }
        this.#specialization = specialization;

        if (typeof maxLoad != 'number' || maxLoad < 0) {
            throw new Error('Max patient load is not valid.')
        }
        this.maxLoad = maxLoad;
        this.availableFrom = null;
        this.availableTill = null;
    }

    get specialization() {
        return this.#specialization;
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

}


module.exports = { Doctor };