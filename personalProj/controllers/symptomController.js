const { Symptom } = require('../models/Symptom');

const getSymptom = async (req, res) => {
    try {
        const symptom = await Symptom.getSymptomById(Number.parseInt(req.params.id));
        if (symptom) {
            res.status(200).json(symptom);
        } else {
            res.status(404).json({ error: 'Symptom not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllSymptoms = async (req, res) => {
    try {
        const filters = {
            name: req.query.name,
            description: req.query.description,
        };
        const symptoms = await Symptom.getSymptoms(filters);
        res.status(200).json(symptoms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createSymptom = async (req, res) => {
    try {
        const { name, description } = req.body;
        const symptom = new Symptom(name, description);
        await symptom.insertSymptom();
        res.status(201).json(symptom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Handles the request to update a symptom by its ID.
 */
const updateSymptom = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const { name, description } = req.body;

        if (!id) return res.status(400).json({ error: 'Symptom ID is required' });
        if ((name && typeof name !== 'string') || name == '') return res.status(400).json({ error: 'Invalid name' });
        if ((description && typeof description !== 'string') || description == '') return res.status(400).json({ error: 'Invalid description' });

        const updates = { name, description };
        const hasParams = Object.values(updates).some(value => value !== undefined);
        if (!hasParams) return res.status(400).json({ error: 'No parameters to update' });

        const updated = await Symptom.updateSymptom(id, updates);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the symptom' });
    }
};

const deleteSymptom = async (req, res) => {
    try {
        const symptom = await Symptom.getSymptomById(req.params.id);
        if (!symptom) return res.status(404).json({ error: 'Symptom not found' });
        await symptom.deleteSymptom();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getSymptom,
    getAllSymptoms,
    createSymptom,
    deleteSymptom,
    updateSymptom
};
