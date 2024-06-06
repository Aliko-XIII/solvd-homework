/**
 * Class representing doctors' specializations.
 */
export class Specialization {
    /**
     * Constructor for Specialization class.
     * @param {string} name - name of doctor's specialization
     * @param {*} description - description of doctor's specialization
     */
    constructor(name, description = '',) {
        this.name = name;
        this.description = description;
    }

    toString() {
        return `Specialization: "${this.name}".
        Description: ${this.description}.`;
    }
}