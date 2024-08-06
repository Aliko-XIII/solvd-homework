const { Appointment } = require('../models/Appointment');
const { Patient } = require('../models/Patient');
const { User } = require('../models/User');

/**
 * Retrieves a patient by ID and sends it in the response.
 */
const getPatient = async (req, res) => {
    try {
        const nestUser = req.query.nestUser === 'true';
        const patient = await Patient.getPatientById(req.params.id, nestUser);
        if (patient) {
            res.status(200).send(patient);
        } else {
            res.status(404).send('Patient not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Retrieves all patients and sends them in the response.
 */
const getAllPatients = async (req, res) => {
    try {
        const { insuranceNumber, insuranceProvider, nestUser } = req.query;
        const patients = await Patient.getPatients({ insuranceNumber, insuranceProvider, nestUser: nestUser === 'true' });
        res.status(200).send(patients);
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Creates a new patient and inserts it into the database.
 */
const createPatient = async (req, res) => {
    try {
        const { insuranceNumber, insuranceProvider, userId } = req.body;
        const existingPatient = await Patient.getPatientByUserId(userId);
        if (existingPatient) {
            return res.status(409).send('There is already a patient record for this user.');
        }

        const user = await User.getUserById(userId);
        const patient = new Patient(insuranceNumber, insuranceProvider, user);
        await patient.insertPatient();
        res.status(201).send(patient);
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Deletes a patient by ID from the database.
 */
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.getPatientById(req.params.id);
        if (patient) {
            await Patient.deletePatient(req.params.id);
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Retrieves appointments for a patient and sends them in the response.
 */
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.getPatientAppointments(req.params.id);
        res.status(200).send(appointments);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getPatient,
    createPatient,
    deletePatient,
    getAllPatients,
    getAppointments
};
