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
            res.status(200).json(patient);
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Retrieves all patients and sends them in the response.
 */
const getAllPatients = async (req, res) => {
    try {
        const { insuranceNumber, insuranceProvider, nestUser } = req.query;
        const patients = await Patient.getPatients({ insuranceNumber, insuranceProvider, nestUser: nestUser === 'true' });
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
            return res.status(409).json({ error: 'There is already a patient record for this user.' });
        }

        const user = await User.getUserById(userId);
        const patient = new Patient(insuranceNumber, insuranceProvider, user);
        await patient.insertPatient();
        res.status(201).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Handles the request to update a patient by their user ID.
 */
const updatePatient = async (req, res) => {
    try {
        const { userId } = req.params;
        const { insuranceNumber, insuranceProvider } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (insuranceNumber && typeof insuranceNumber !== 'string') {
            return res.status(400).json({ error: 'Invalid insurance number' });
        }

        if (insuranceProvider && typeof insuranceProvider !== 'string') {
            return res.status(400).json({ error: 'Invalid insurance provider' });
        }

        const updates = { insuranceNumber, insuranceProvider };
        const hasParams = Object.values(updates).some(value => value !== undefined);

        if (!hasParams) {
            return res.status(400).json({ error: 'No parameters to update' });
        }

        await Patient.updatePatient(userId, updates);

        res.status(200).json({ message: 'Patient updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the patient' });
    }
};

/**
 * Retrieves appointments for a patient and sends them in the response.
 */
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.getPatientAppointments(req.params.id);
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getPatient,
    createPatient,
    deletePatient,
    getAllPatients,
    updatePatient,
    getAppointments
};
