const { Patient } = require('../models/Patient');
const { User } = require('../models/User');

const getPatient = async (req, res) => {
    try {
        const patient = await Patient.getPatientsById(req.params.id)[0];
        res.status(200).send('patient', { patient: patient });
    } catch (err) {
        res.status(500).send(err);
    }
};

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

const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.getPatientsById(req.params.id)[0];
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

module.exports = {
    getPatient,
    createPatient,
    deletePatient,
}