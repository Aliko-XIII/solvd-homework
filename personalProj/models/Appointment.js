const { query } = require("../config/database");
const { Symptom } = require("./Symptom");
const { Patient } = require("./Patient");
const { Doctor } = require("./Doctor");

class Appointment {
    /**
     * 
     * @param {Patient} patient 
     * @param {Doctor} doctor 
     * @param {Date} time 
     * @param {number} duration 
     * @param {string} description 
     * @param {number} id 
     */
    constructor(patient, doctor, time, duration, description, id = -1) {
        if (typeof description !== 'string') throw new Error('Description is not valid');

        this.id = id;
        this.time = time;
        this.duration = duration;
        this.description = description;
        this.patient = patient;
        this.doctor = doctor;
        this.symptoms = [];
    }

    static async getAppointmentsFromData(rows) {
        if (rows.length == 0) { return []; }
        const appointments = rows.map(async row => {
            const patient = (await Patient.getPatientsByIds(row.patient_id))[0];
            const doctor = (await Doctor.getDoctorsById(row.doctor_id))[0];
            console.log(doctor);
            const appointment = new Appointment(patient, doctor, row.appointment_time,
                row.appointment_duration, row.additional_info, row.appointment_id);
            return appointment;
        });
        return Promise.all(appointments);
    }

    static async getAppointments() {
        const res = await query(`SELECT * FROM appointments;`);
        return await Appointment.getAppointmentsFromData(res.rows);
    }

    static async getAppointmentsById(...id) {
        const res = await query(`SELECT * FROM appointments 
            WHERE id IN (${id.toString()});`);
        return await this.getAppointmentsFromData(res.rows);
    }

    async insertAppointment() {
        const res = await query(`INSERT INTO public.appointments(
	        "time", duration_minutes, description, patient, doctor)
	        VALUES ('${this.time}', ${this.duration}, '${this.description}', 
            ${this.patient.id}, ${this.doctor.id}) RETURNING *;`);
        this.id = res.rows[0].id;

        for (let symptom of this.symptoms) {
            const symptomRes = await query(`INSERT INTO public.appointments_to_symptoms(
	            appointment, symptom, organ)
	            VALUES (${this.id}, ${symptom.id}, NULL);`);
        }
        console.log('Inserted:', res.rows[0]);
    }

    async deleteAppointment() {
        const res = await query(`DELETE FROM appointments WHERE id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }

    /**
     * 
     * @param {Doctor} doctor 
     */
    static async getDoctorAppointments(doctorId) {
        const res = await query(`SELECT * FROM appointments 
            WHERE doctor = ${doctorId};`);
        return await this.getAppointmentsFromData(res.rows);
    }

    /**
     * 
     * @param {Patient} patient 
     */
    static async getPatientAppointments(patientId) {
        const res = await query(`SELECT * FROM appointments 
            WHERE patient = ${patientId};`);
        return await this.getAppointmentsFromData(res.rows);
    }

}

module.exports = { Appointment };

