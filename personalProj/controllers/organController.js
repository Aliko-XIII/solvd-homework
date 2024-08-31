const { Organ } = require('../models/Organ');

const getOrgan = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const organ = await Organ.getOrganById(id);
        if (organ) {
            res.status(200).json(organ);
        } else {
            res.status(404).json({ error: 'Organ not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllOrgans = async (req, res) => {
    try {
        const filters = {
            name: req.query.name,
            description: req.query.description,
        };
        const organs = await Organ.getOrgans(filters);
        res.status(200).json(organs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createOrgan = async (req, res) => {
    try {
        const { name, description } = req.body;
        const organ = new Organ(name, description);
        await organ.insertOrgan();
        res.status(201).json(organ);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateOrgan = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const { name, description } = req.body;

        if (!id) return res.status(400).json({ error: 'Organ ID is required' });
        if ((name && typeof name !== 'string') || name == '') return res.status(400).json({ error: 'Invalid name' });
        if ((description && typeof description !== 'string') || description == '') return res.status(400).json({ error: 'Invalid description' });

        const updates = { name, description };
        const hasParams = Object.values(updates).some(value => value !== undefined);
        if (!hasParams) return res.status(400).json({ error: 'No parameters to update' });

        const updated = await Organ.updateOrgan(id, updates);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the organ' });
    }
};

const deleteOrgan = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const organ = await Organ.getOrganById(id);
        if (organ) {
            await organ.deleteOrgan();
            res.sendStatus(204);
        } else {
            res.status(404).json({ error: 'Organ not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getOrgan,
    getAllOrgans,
    createOrgan,
    deleteOrgan,
    updateOrgan
};
