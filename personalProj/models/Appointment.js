const { query } = require("../config/database");
const { Symptom } = require("./Symptom");
const { Patient } = require("./Patient");
const { Doctor } = require("./Doctor");

class Appointment {

    static workStart = 8;
    static workEnd = 16;

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

        this.id = id;

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

        this.symptoms = [];
    }

    static async getAppointmentsFromData(rows) {
        if (rows.length == 0) { return []; }
        const symptoms = await Symptom.getSymptoms();
        const toSymptomsQuery = await query(`SELECT * FROM appointments_to_symptoms;`);

        const appointments = [];
        for (let row of rows) {
            const patient = (await Patient.getPatientsById(row.patient))[0];
            const doctor = (await Doctor.getDoctorsById(row.doctor))[0];
            let appointment = new Appointment(patient, doctor, row.time,
                row.duration_minutes, row.description, row.id);
            appointments.push(appointment);

            let appointmentSymptoms = toSymptomsQuery.rows
                .filter(rec => rec.appointment == appointment.id)
                .map(rec => symptoms.find(symptom => symptom.id == rec.symptom));
            appointment.symptoms.push(...appointmentSymptoms);
        }
        return appointments;
    }

    static async getAppointments() {
        const res = await query(`SELECT * FROM appointments;`);
        return await this.getAppointmentsFromData(res.rows);
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

