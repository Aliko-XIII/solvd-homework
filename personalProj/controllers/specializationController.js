const { Specialization } = require('../models/Specialization');

const getSpecialization = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const nestOrgans = req.query.nestOrgans === 'true';
        const nestSymptoms = req.query.nestSymptoms === 'true';

        const specialization = await Specialization.getSpecializationById(
            id,
            nestOrgans,
            nestSymptoms
        );

        if (specialization) {
            res.status(200).send(specialization);
        } else {
            res.status(404).json({ error: 'Specialization not found.' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const getAllSpecializations = async (req, res) => {
    try {
        const filters = {
            name: req.query.name,
            description: req.query.description,
            nestOrgans: req.query.nestOrgans === 'true',
            nestSymptoms: req.query.nestSymptoms === 'true',
            symptomId: req.query.symptomId,
            organId: req.query.organId,
        };

        const specializations = await Specialization.getSpecializations(filters);

        res.status(200).send(specializations);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const createSpecialization = async (req, res) => {
    try {
        const { name, description, symptoms, organs } = req.body;
        const specialization = new Specialization(name, description, symptoms, organs);
        await specialization.insertSpecialization();
        res.status(201).send(specialization);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const deleteSpecialization = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const specialization = await Specialization.getSpecializationById(id);
        if (specialization) {
            await specialization.deleteSpecialization();
            res.sendStatus(204);
        } else {
            res.status(404).json({ error: 'Specialization not found.' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const updateSpecialization = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
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
        if (!hasParams) return res.status(400).json({ error: 'No parameters to update' });

        const updated = await Specialization.updateSpecialization(id, updates);
        res.status(200).json(updated);
    } catch (error) {
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
