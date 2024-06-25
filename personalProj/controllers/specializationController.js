const { Specialization } = require('../models/Specialization');

const getSpecialization = async (req, res) => {
    try {
        const specialization = (await Specialization.getSpecializationsById(req.params.id))[0];
        if (specialization) {
            res.status(200).send({ specialization: specialization });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllSpecializations = async (req, res) => {
    try {
        const specializations = await Specialization.getSpecializations();
        res.status(200).send({ specializations: specializations });
    } catch (err) {
        res.status(500).send(err);
    }
};

const createSpecialization = async (req, res) => {
    try {
        const { name, description, locationOrgan } = req.body;
        const symptom = new Symptom(name, description, locationOrgan);
        await symptom.insertSymptom();
        res.status(201).send(symptom);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteSpecialization = async (req, res) => {
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
    getSpecialization,
    getAllSpecializations,
    createSpecialization,
    deleteSpecialization
};
