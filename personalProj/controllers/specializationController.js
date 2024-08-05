const { Specialization } = require('../models/Specialization');

const getSpecialization = async (req, res) => {
    try {
        const specialization = (await Specialization.getSpecializationsById(req.params.id))[0];
        if (specialization) {
            res.status(200).send(specialization);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllSpecializations = async (req, res) => {
    try {
        // Extract query parameters
        const nestOrgans = req.query.nestOrgans === 'true';
        const nestSymptoms = req.query.nestSymptoms === 'true';

        // Fetch specializations with the specified parameters
        const specializations = await Specialization.getSpecializations(nestOrgans, nestSymptoms);

        // Send the response with the fetched specializations
        res.status(200).send(specializations);
    } catch (err) {
        // Handle any errors that occur during the request
        res.status(500).send(err);
    }
};

const createSpecialization = async (req, res) => {
    try {
        const { name, description, symptoms, organs } = req.body;
        const specialization = new Specialization(name, description, symptoms, organs);
        await specialization.insertSpecialization();
        res.status(201).send(specialization);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteSpecialization = async (req, res) => {
    try {
        const specialization = (await Specialization.getSpecializationsById(req.params.id))[0];
        if (specialization) {
            await specialization.deleteSpecialization();
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
