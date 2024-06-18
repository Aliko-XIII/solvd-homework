import { User } from "./User";

/**
 * Class representing hospital's patient.
 */
export class Patient extends User {

    constructor(name, surname, age, phone, password, sex = "Empty") {
        super(name, surname, password, age, sex);

        // Check if phone number is string which contains only numbers
        if(typeof phone!= 'string' ||
            /^\d+$/.test(phone)
        )
        this.phone = phone;
    }
}