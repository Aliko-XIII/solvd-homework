const { Specialization } = require('../models/Specialization');

const getSpecialization = async (req, res) => {
    try {
        const nestOrgans = req.query.nestOrgans === 'true';
        const nestSymptoms = req.query.nestSymptoms === 'true';

        const specialization = (await Specialization.getSpecializationsById(
            nestOrgans,
            nestSymptoms,
            req.params.id
        ))[0];

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
        const filters = {
            name: req.query.name,
            description: req.query.description,
            nestOrgans: req.query.nestOrgans === 'true',
            nestSymptoms: req.query.nestSymptoms === 'true',
        };

        const specializations = await Specialization.getSpecializations(filters);

        res.status(200).send(specializations);
    } catch (err) {
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
        const specialization = (await Specialization.getSpecializationsById(
            false, false, req.params.id))[0];
        if (specialization) {
            await specialization.deleteSpecialization();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const updateSpecialization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, symptoms, organs } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Specialization ID is required' });
        }

        if (name && typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid specialization name' });
        }

        if (description && typeof description !== 'string') {
            return res.status(400).json({ error: 'Invalid specialization description' });
        }

        const updates = { name, description, symptoms, organs };
        const hasParams = Object.values(updates).some(value => value !== undefined);

        if (!hasParams) {
            return res.status(400).json({ error: 'No parameters to update' });
        }

        await Specialization.updateSpecialization(id, updates);

        res.status(200).json({ message: 'Specialization updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the specialization' });
    }
};

module.exports = {
    getSpecialization,
    getAllSpecializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization
};
