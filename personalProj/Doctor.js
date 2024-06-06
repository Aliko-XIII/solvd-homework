import { Specialization } from "./Specialization";

/**
 * Class representing hospital's doctor.
 */
class Doctor {
    #specialization;
    /**
     * Constructor for Doctor class.
     * @param {string} name - doctor's name
     * @param {string} surname - doctor's surname
     * @param {number} age - doctor's age
     * @param {Specialization} specialization - doctor's specialization 
     * @param {string} sex - doctor's sex
     */
    constructor(name, surname, age, specialization, sex = "Not mentioned") {
        if (typeof specialization !== 'undefined' &&
            typeof specialization !== 'object') {
            throw new Error('Wrong specialization data type.');
        }
        this.#specialization = specialization;

        if (typeof name !== 'string' ||
            name.length == 0
        ) {
            throw new Error('Name is not valid.')
        }
        this.name = name;

        if (typeof surname !== 'string' ||
            surname.length == 0
        ) {
            throw new Error('Surname is not valid.')
        }
        this.surname = surname;

        if (typeof surname !== 'string' ||
            surname.length == 0
        ) {
            throw new Error('Sex is not valid.')
        }
        this.sex = sex;

        if (typeof age !== 'number' || age <= 18 || age > 70) {
            throw new Error('Age is not valid.')
        }
        this.age = age;
    }

}