const { User } = require("./User");
const { Role } = require("./Role");
const { client } = require("../config/database");

/**
 * Class representing hospital's patient.
 */
class Patient extends Role {
    /**
     * Creates an instance of Patient.
     * @param {string} phone - patient's phone number
     * @param {string} insurance - patient's insurance
     * @param {User} user - patient's user record
     */
    constructor(phone, insurance, user) {
        super(user);
        // Check if phone number is string which contains only numbers
        if (typeof phone != 'string' ||
            /^\d+$/.test(phone)
        ) {
            throw new Error('Phone number is not valid.');
        }
        this.phone = phone;

        if (typeof insurance != 'string') {
            throw new Error('Insurance is not valid.');
        }
        this.insurance = insurance;
    }

    /**
     * 
     * @returns {Patient[]}
     */
    static async getPatients() {
        try {
            const res = await client.query(`SELECT * FROM patients;`);
            const patients = [];
            const users = await User.getUsersById(...res.rows.map(row => row.user_id));
            users.forEach(user => {
                let userRow = res.rows.find(row => row.user_id == user.id);
                if (userRow) {
                    patients.push(new Patient(userRow.phone, userRow.insurance, user));
                }
            });
            return patients;
        } catch (err) {
            console.error('Error executing query', err.stack);
            throw err;
        }
    }
}


module.exports = { Patient };

Patient.getPatients().then(patients => console.log(patients.map(patient => patient.user)));