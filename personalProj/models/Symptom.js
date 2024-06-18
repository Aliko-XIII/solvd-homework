// import { Organ } from "./Organ";

/**
 * Class representing patients' symptoms.
 */
export class Symptom {
    constructor(name, locationOrgan = null, description = '') {
        if (typeof name !== 'string') {
            throw new Error('Name should be string');
        }
        this.name = name;

        if (typeof this.locationOrgan !== 'object') {
            throw new Error('Organ should be object');
        }
        this.locationOrgan = locationOrgan;

        if (typeof description !== 'string') {
            throw new Error('Description should be string');
        }
        this.description = description;
    }Organ

    toString() {
        return `Symptom "${this.name}"
        Description: ${this.description.length == 0 ? 'Empty.' : this.description}
        Location: ${this.locationOrgan == null ? 'Not mentioned' : `\n` + this.locationOrgan.toString()}`;
    }
}