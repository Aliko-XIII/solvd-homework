const { User } = require("./User");
const { Role } = require("./Role");
const { query } = require("../config/database");

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

    static async getPatientsFromData(rows) {
        if (rows.length == 0) { return []; }
        const patients = [];
        const users = await User.getUsersById(...rows.map(row => row.user_id));
        users.forEach(user => {
            let userRow = rows.find(row => row.user_id == user.id);
            if (userRow) {
                patients.push(new Patient(userRow.phone, userRow.insurance, user));
            }
        });
        return patients;
    }

    /**
     * 
     * @returns {Patient[]}
     */
    static async getPatients() {
        const res = await query(`SELECT * FROM patients;`);
        return await this.getPatientsFromData(res.rows);
    }

    /**
     * 
     * @returns {Patient[]}
     */
    static async getPatientsById(...id) {
        const res = await query(`SELECT * FROM patients
            WHERE user_id IN (${id.toString()});`);
        return await this.getPatientsFromData(res.rows);
    }

    async insertPatient() {
        const res = await query(`INSERT INTO patients(
	        phone, insurance, user_id)
            VALUES ('${this.phone}', '${this.insurance}', ${this.user.id}) RETURNING *;`);
        this.id = res.rows[0].id;
        console.log('Inserted:', res.rows[0]);
    }

    async deletePatient() {
        const res = await query(`DELETE FROM patients WHERE user_id = ${this.user.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }
}

// const test = new Patient('test', 'descr', new User('fsdaf', 'afsdf', 'dsafdasf', 24, 'M', 8));
// test.deletePatient();

module.exports = { Patient };