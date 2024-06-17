// import { Symptom } from "./Symptom";
// import { Organ } from "./Organ";

/**
 * Class representing doctors' specializations.
 */
export class Specialization {
    /**
     * Constructor for Specialization class.
     * @param {string} name - name of doctor's specialization
     * @param {string} description - description of doctor's specialization
     * @param {Symptom[]} symptoms - symptoms treated with doctor's specialization
     * @param {Organ[]} organs - organs treated with doctor's specialization
     */
    constructor(name, description = '', symptoms = [], organs = []) {
        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name;

        if (typeof description !== 'string') {
            throw new Error('Description should be string');
        }
        this.description = description;

        if (!Array.isArray(symptoms)) {
            throw new Error('Symptoms should be array');
        }
        this.symptoms = symptoms;

        if (!Array.isArray(organs)) {
            throw new Error('Organs should be array');
        }
        this.organs = organs;
    }

    toString() {
        return `Specialization: "${this.name}".
        Description: ${this.description}.`;
    }
}