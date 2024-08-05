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
    }

    static async getAppointmentsFromData(rows, nestDoctor = false, nestPatient = false) {
        const appointments = rows.map(async row => {
            let patient = { id: row.patient_id };
            let doctor = { id: row.doctor_id };
            if (nestPatient) {
                patient = (await Patient.getPatientsByIds(false, row.patient_id))[0];
            }
            if (nestDoctor) {
                doctor = (await Doctor.getDoctorsById(row.doctor_id))[0];
            }
            const appointment = new Appointment(patient, doctor, row.appointment_time,
                row.appointment_duration, row.additional_info, row.appointment_id);
            return appointment;
        });
        return Promise.all(appointments);
    }

    static async getAppointments({ patientId, doctorId, nestDoctor, nestPatient, startBefore, startAfter, endBefore, endAfter } = {}) {
        let queryStr = `SELECT * FROM appointments WHERE 1=1`;
        if (patientId) {
            queryStr += ` AND patient_id = '${patientId}'`;
        }
        if (doctorId) {
            queryStr += ` AND doctor_id = '${doctorId}'`;
        }
        if (startBefore) {
            queryStr += ` AND appointment_time < '${startBefore}'`;
        }
        if (startAfter) {
            queryStr += ` AND appointment_time > '${startAfter}'`;
        }
        if (endBefore) {
            queryStr += ` AND appointment_time + appointment_duration < '${endBefore}'`;
        }
        if (endAfter) {
            queryStr += ` AND appointment_time + appointment_duration > '${endAfter}'`;
        }
        const res = await query(queryStr);
        return await this.getAppointmentsFromData(res.rows, nestDoctor, nestPatient);
    }

    static async getAppointmentsById(ids, nestDoctor = false, nestPatient = false) {
        const idList = ids.map(id => `'${id}'`).join(',');
        const res = await query(`SELECT * FROM appointments 
            WHERE appointment_id IN (${idList});`);
        return await this.getAppointmentsFromData(res.rows, nestDoctor, nestPatient);
    }

    async insertAppointment() {
        const res = await query(`INSERT INTO public.appointments(
	        appointment_time, appointment_duration, additional_info, patient_id, doctor_id)
	        VALUES ('${this.time}', ${this.duration}, '${this.description}', 
            ${this.patient.id}, ${this.doctor.id}) RETURNING *;`);
        this.id = res.rows[0].appointment_id;
        console.log('Inserted:', res.rows[0]);
    }

    async deleteAppointment() {
        const res = await query(`DELETE FROM appointments WHERE appointment_id = ${this.id} RETURNING *;`);
        console.log('Deleted:', res.rows[0]);
    }

    /**
     * 
     * @param {Doctor} doctor 
     */
    static async getDoctorAppointments(doctorId) {
        const res = await query(`SELECT * FROM appointments 
            WHERE doctor_id = ${doctorId};`);
        return await this.getAppointmentsFromData(res.rows);
    }

    /**
     * 
     * @param {Patient} patient 
     */
    static async getPatientAppointments(patientId) {
        const res = await query(`SELECT * FROM appointments 
            WHERE patient_id = ${patientId};`);
        return await this.getAppointmentsFromData(res.rows);
    }
}

module.exports = { Appointment };
