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
     * @param {Date} duration 
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

    /**
     * Validates that the input value is a non-empty string.
     * 
     * @param {string} value - The value to validate.
     * @returns {boolean} - Returns true if the value is a non-empty string, otherwise false.
     */
    validateString(value) {
        return typeof value === 'string' && value.length > 0;
    }

    static async getAppointmentsFromData(rows, nestDoctor = false, nestPatient = false) {
        const appointments = rows.map(async row => {
            let patient = null;
            if (row.patient_id != null) {
                patient = nestPatient ? (await Patient.getPatientsByIds([row.patient_id], true))[0] :
                    { id: row.patient_id };
            }
            let doctor = null;
            if (row.doctor_id != null) {
                doctor = nestDoctor ? (await Doctor.getDoctorsByIds([row.doctor_id]))[0] :
                    { id: row.doctor_id };
            }


            const appointment = new Appointment(patient, doctor, row.appointment_time,
                row.appointment_duration, row.additional_info, row.appointment_id);
            return appointment;
        });
        return Promise.all(appointments);
    }

    static async getAppointments({ patientId, doctorId, nestDoctor, nestPatient, startBefore, startAfter, endBefore, endAfter } = {}) {
        let queryStr = `SELECT * FROM appointments `;

        const conditions = [];
        if (patientId) conditions.push(`patient_id = '${patientId}'`);
        if (doctorId) conditions.push(`doctor_id = '${doctorId}'`);
        if (startBefore) conditions.push(`appointment_time < '${startBefore}'`);
        if (startAfter) conditions.push(`appointment_time > '${startAfter}'`);
        if (endBefore) conditions.push(`appointment_time + appointment_duration < '${endBefore}'`);
        if (endAfter) conditions.push(`appointment_time + appointment_duration > '${endAfter}'`);
        if (conditions.length > 0) queryStr += ` WHERE ${conditions.join(' AND ')}`;

        const res = await query(queryStr);
        return await this.getAppointmentsFromData(res.rows, nestDoctor, nestPatient);
    }

    static async getAppointmentsByIds(ids, nestDoctor = false, nestPatient = false) {
        const idList = ids.map(id => `'${id}'`).join(',');
        const res = await query(`SELECT * FROM appointments 
            WHERE appointment_id IN (${idList});`);
        return await this.getAppointmentsFromData(res.rows, nestDoctor, nestPatient);
    }

    /**
     * Update the current Appointment object in the database.
     * @param {Object} updates - The fields to update.
     * @param {Date|null} [updates.time] - The new appointment time.
     * @param {string} [updates.duration] - The new appointment duration (Postgres interval).
     * @param {string} [updates.description] - The new appointment description.
     * @param {string} [updates.patientId] - The new patient ID.
     * @param {string} [updates.doctorId] - The new doctor ID.
     * @returns {Promise<void>} A promise that resolves when the appointment is updated.
     */
    static async updateAppointment(id, { time, duration, description, patientId, doctorId }) {
        if (id === -1) throw new Error('No ID provided to update appointment record.');
        const hasParams = Object.keys({ time, duration, description, patientId, doctorId })
            .some(value => value !== undefined);
        if (!hasParams) throw new Error('No parameters to update.');

        const updates = [];
        let queryStr = `UPDATE appointments SET `;
        if (time) updates.push(`appointment_time = '${time}'`);
        if (duration) updates.push(`appointment_duration = '${duration}'`);
        if (description) updates.push(`additional_info = '${description}'`);
        if (patientId) updates.push(`patient_id = '${patientId}'`);
        if (doctorId) updates.push(`doctor_id = '${doctorId}'`);
        if (updates.length > 0) queryStr += ` ${updates.join(', ')} `;
        queryStr += `WHERE appointment_id = ${id} RETURNING *;`;

        const res = await query(queryStr);
        console.log('Updated:', res.rows[0]);
        const updated = (await Appointment.getAppointmentsFromData(res.rows))[0];
        return updated;
    }

    async insertAppointment() {
        const res = await query(`INSERT INTO appointments(
	        appointment_time, appointment_duration, additional_info, patient_id, doctor_id)
	        VALUES ('${this.time}', '${this.duration}', '${this.description}', 
            '${this.patient.id}', '${this.doctor.id}') RETURNING *;`);
        this.id = res.rows[0].appointment_id;
        console.log('Inserted:', res.rows[0]);
        return { id: this.id };
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
            WHERE doctor_id = '${doctorId}';`);
        return await Appointment.getAppointmentsFromData(res.rows, true, true);
    }

    /**
     * 
     * @param {Patient} patient 
     */
    static async getPatientAppointments(patientId) {
        const res = await query(`SELECT * FROM appointments 
            WHERE patient_id = '${patientId}';`);
        return await Appointment.getAppointmentsFromData(res.rows, true, true);
    }
}

module.exports = { Appointment };
