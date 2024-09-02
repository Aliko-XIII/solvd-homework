const { query } = require('../config/database');
const { Patient } = require('./Patient');
const { Doctor } = require('./Doctor');

class Appointment {
    /**
     * Creates an Appointment object.
     * @param {Patient} patient - The patient associated with the appointment.
     * @param {Doctor} doctor - The doctor assigned to the appointment.
     * @param {string} time - The time of the appointment in 'YYYY-MM-DD HH:MM:SS' format.
     * @param {string} duration - The duration of the appointment (PostgreSQL interval type).
     * @param {string} description - Additional information about the appointment.
     * @param {number} id - The appointment ID, defaults to -1 if not provided.
     */
    constructor(patient, doctor, time, duration, description, id = -1) {
        if (!time) throw new Error('No appointment time provided');
        if (!duration) throw new Error('No appointment duration provided');
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
     * @param {string} value - The value to validate.
     * @returns {boolean} - Returns true if the value is a non-empty string, otherwise false.
     */
    validateString(value) {
        return typeof value === 'string' && value.length > 0;
    }

    /**
     * Converts rows of appointment data from the database into an array of Appointment objects.
     * @param {Array} rows - The rows of data returned from the database query.
     * @param {boolean} nestDoctor - Whether to nest the full Doctor object or just the doctor ID.
     * @param {boolean} nestPatient - Whether to nest the full Patient object or just the patient ID.
     * @returns {Promise<Appointment[]>} - An array of Appointment objects.
     */
    static async getAppointmentsFromData(rows, nestDoctor = false, nestPatient = false) {
        const appointments = rows.map(async row => {
            let patient = null;
            if (row.patient_id != null) {
                patient = nestPatient ? (await Patient.getPatientsByIds([row.patient_id]))[0] :
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

    /**
     * Fetches appointments from the database based on provided filters.
     * @param {Object} [filters] - Optional filters for appointments (patientId, doctorId, etc.).
     * @returns {Promise<Appointment[]>} - An array of Appointment objects.
     */
    static async getAppointments({ patientId, doctorId, nestDoctor, nestPatient, startBefore, startAfter, endBefore, endAfter } = {}) {
        let queryStr = `SELECT appointment_id, patient_id, doctor_id, appointment_time,
         appointment_duration::TEXT AS appointment_duration, additional_info FROM appointments `;

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

    /**
     * Fetches appointments by their IDs from the database.
     * @param {Array<string>} ids - The list of appointment IDs to fetch.
     * @param {boolean} nestDoctor - Whether to nest the full Doctor object.
     * @param {boolean} nestPatient - Whether to nest the full Patient object.
     * @returns {Promise<Appointment[]>} - An array of Appointment objects.
     */
    static async getAppointmentsByIds(ids, nestDoctor = false, nestPatient = false) {
        const idList = ids.map(id => `'${id}'`).join(',');
        const res = await query(`SELECT appointment_id, patient_id, doctor_id, appointment_time,
             appointment_duration::TEXT AS appointment_duration, additional_info FROM appointments 
            WHERE appointment_id IN (${idList});`);
        return await this.getAppointmentsFromData(res.rows, nestDoctor, nestPatient);
    }

    /**
     * Updates the appointment in the database with new values.
     * @param {number} id - The appointment ID to update.
     * @param {Object} updates - The fields to update.
     * @returns {Promise<Appointment>} - The updated appointment object.
     */
    static async updateAppointment(id, { time, duration, description, patientId, doctorId }) {
        if (id === -1) throw new Error('No ID provided to update appointment record.');
        const hasParams = Object.values({ time, duration, description, patientId, doctorId })
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
        const updated = (await Appointment.getAppointmentsFromData(res.rows))[0];
        return updated;
    }

    /**
     * Inserts a new appointment into the database.
     * @returns {Promise<Object>} - The inserted appointment's ID.
     */
    async insertAppointment() {
        if (!(await this.isAvailable())) throw new Error('This appointment time is not available');
        const res = await query(`INSERT INTO appointments(
	        appointment_time, appointment_duration, additional_info, patient_id, doctor_id)
	        VALUES ('${this.time}', '${this.duration}', '${this.description}', 
            '${this.patient.user.id}', '${this.doctor.user.id}') RETURNING *;`);
        this.id = res.rows[0].appointment_id;
        return { id: this.id };
    }

    /**
     * Checks whether the doctor and patient are available for the given appointment time and duration.
     * @returns {Promise<boolean>} - Returns true if the time slot is available, otherwise false.
     */
    async isAvailable() {
        const doctorDateAppointments = await Appointment.
            getDoctorAppointments(this.doctor.user.id, { date: this.time.split(' ')[0] });
        if (doctorDateAppointments.length >= this.doctor.patientLoad) return false;
        const doctorIntersectAppointments = await Appointment.
            getDoctorAppointments(this.doctor.user.id, {
                date: this.time.split(' ')[0],
                time: this.time.split(' ')[1],
                duration: this.duration
            });
        if (doctorIntersectAppointments.length > 0) return false;
        const patientIntersectAppointments = await Appointment.
            getPatientAppointments(this.patient.user.id, {
                date: this.time.split(' ')[0],
                time: this.time.split(' ')[1],
                duration: this.duration
            });
        if (patientIntersectAppointments.length > 0) return false;
        return true;
    }

    /**
     * Deletes the appointment from the database.
     * @returns {Promise<void>} - Resolves when the appointment is deleted.
     */
    async deleteAppointment() {
        await query(`DELETE FROM appointments WHERE appointment_id = ${this.id} RETURNING *;`);
    }

    /**
     * Fetches all appointments for a specific doctor.
     * @param {string} doctorId - The doctor's ID.
     * @param {Object} [filters] - Optional filters (date, time, duration).
     * @returns {Promise<Appointment[]>} - An array of appointments for the doctor.
     */
    static async getDoctorAppointments(doctorId, { date, time, duration } = {}) {
        let queryStr = `SELECT appointment_id, patient_id, doctor_id,
             appointment_time, appointment_duration::TEXT AS appointment_duration, additional_info FROM appointments 
            WHERE doctor_id = '${doctorId}' `;
        if (date) queryStr += ` AND DATE(appointment_time) = '${date}'`;
        if (date && time && duration) queryStr += `AND appointment_time < (TIMESTAMP '${date} ${time}'
         + INTERVAL '${duration}')
        AND (appointment_time + appointment_duration) > '${date} ${time}'`;

        const res = await query(queryStr);
        return await this.getAppointmentsFromData(res.rows);
    }

    /**
     * Fetches all appointments for a specific patient.
     * @param {string} patientId - The patient's ID.
     * @param {Object} [filters] - Optional filters (date, time, duration).
     * @returns {Promise<Appointment[]>} - An array of appointments for the patient.
     */
    static async getPatientAppointments(patientId, { date, time, duration } = {}) {
        let queryStr = `SELECT appointment_id, patient_id, doctor_id,
         appointment_time, appointment_duration::TEXT AS appointment_duration, additional_info FROM appointments 
            WHERE patient_id = '${patientId}' `;
        if (date) queryStr += ` AND DATE(appointment_time) = '${date}'`;
        if (date && time && duration) queryStr += `AND appointment_time < (TIMESTAMP '${date} ${time}'
         + INTERVAL '${duration}')
        AND (appointment_time + appointment_duration) > '${date} ${time}'`;

        const res = await query(queryStr);
        return await this.getAppointmentsFromData(res.rows);
    }
}

module.exports = { Appointment };
