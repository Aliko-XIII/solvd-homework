const { query } = require("../config/database");

class Appointment {

    static workStart = 8;
    static workEnd = 16;

    constructor(patient, doctor, time, duration, description, id) {
        
        this.time = time;

        if (typeof duration !== 'number') {
            throw new Error('Duration should be integer number of minutes');
        }
        this.duration = duration;

        if (typeof description !== 'string') {
            throw new Error('Description is not valid')
        }
        this.description = description;

        this.patient = patient;

        this.doctor = doctor;
    }

    static async getAppointmentsFromData(rows) {
        if (rows.length == 0) { return []; }
        const appointments = [];
        rows.forEach(row => {
            let appointment = new Appointment(row.patient, row.doctor,
                row.time, row.duration_minutes, row.description, row.id);
            appointments.push(appointment);
        });
        return appointments;
    }

    static async getAppointments() {
        const res = await query(`SELECT * FROM appointments;`);
        return await this.getAppointmentsFromData(res.rows);
    }

    async deleteAppointment() {
        const res = await query(`DELETE FROM appointments WHERE id = ${this.id} RETURNING *;`);
        consol
        e.log('Deleted:', res.rows[0]);
    }

}

// Appointment.getAppointments().then(console.log)

module.exports = { Appointment };

