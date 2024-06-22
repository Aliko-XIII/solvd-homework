const { Patient } = require('../models/Patient');

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
        const {} = req.body;
        const patient = new Patient(name, surname, password, age, sex);
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