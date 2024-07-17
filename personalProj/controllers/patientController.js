const { Appointment } = require('../models/Appointment');
const { Patient } = require('../models/Patient');
const { User } = require('../models/User');

/**
 * Retrieves a patient by ID and sends it in the response.
 */
const getPatient = async (req, res) => {
    try {
        const patient = (await Patient.getPatientsById(req.params.id))[0];
        res.status(200).send({ patient: patient });
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Retrieves all patients and sends them in the response.
 */
const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.getPatients();
        res.status(200).send({ patients: patients });
    } catch (err) {
        res.status(500).send(err);
    }
};

/**
 * Creates a new patient and inserts it into the database.
 */
const createPatient = async (req, res) => {
    try {
        const { phone, insurance, userId } = req.body;
        const user = await User.getUsersById(userId)[0];
        const patient = new Patient(phone, insurance, user);
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
        const patient = (await Patient.getPatientsById(req.params.id))[0];
        if (patient) {
            await patient.deletePatient();
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
        res.status(200).send({ appointments: appointments });
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
