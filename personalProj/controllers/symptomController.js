const { Symptom } = require('../models/Symptom');

const getSymptom = async (req, res) => {
    try {
        const symptom = (await Symptom.getSymptomsById(req.params.id))[0];
        if (symptom) {
            res.status(200).send(symptom);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllSymptoms = async (req, res) => {
    try {
        const filters = {
            name: req.query.name,
            description: req.query.description,
        };
        const symptoms = await Symptom.getSymptoms(filters);
        res.status(200).send(symptoms);
    } catch (err) {
        res.status(500).send(err);
    }
};


const createSymptom = async (req, res) => {
    try {
        const { name, description, locationOrgan } = req.body;
        const symptom = new Symptom(name, description, locationOrgan);
        await symptom.insertSymptom();
        res.status(201).send(symptom);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteSymptom = async (req, res) => {
    try {
        const symptom = (await Symptom.getSymptomsById(req.params.id))[0];
        if (symptom) {
            await symptom.deleteSymptom();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getSymptom,
    getAllSymptoms,
    createSymptom,
    deleteSymptom
};
