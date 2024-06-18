// import { Specialization } from "./Specialization";
import { User } from "./User";

/**
 * Class representing hospital's doctor.
 */
export class Doctor extends User {
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
     * Constructor for Doctor class.
     * @param {string} name - doctor's name
     * @param {string} surname - doctor's surname
     * @param {string} password - doctor's password
     * @param {number} age - doctor's age
     * @param {number} maxLoad - max amount of patients per day for doctor
     * @param {Specialization} specialization - doctor's specialization 
     * @param {string} sex - doctor's sex
     */
    constructor(name, surname, age, password, specialization = null, sex = "Empty", maxLoad = 1) {
        if (age <= 18 || age > 70) {
            throw new Error('Doctor\'s age should be from 18 to 70.')
        }
        super(name, surname, password, age, sex);

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
}