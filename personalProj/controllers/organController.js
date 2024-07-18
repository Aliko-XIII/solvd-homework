const { Organ } = require('../models/Organ');

const getOrgan = async (req, res) => {
    try {
        const organ = (await Organ.getOrgansById(req.params.id))[0];
        if (organ) {
            res.status(200).send(organ);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllOrgans = async (req, res) => {
    try {
        const organs = await Organ.getOrgans();
        res.status(200).send(organs);
    } catch (err) {
        res.status(500).send(err);
    }
};

const createOrgan = async (req, res) => {
    try {
        const { name, description } = req.body;
        const organ = new Organ(name, description);
        await organ.insertOrgan();
        res.status(201).send(organ);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteOrgan = async (req, res) => {
    try {
        const organ = (await Organ.getOrgansById(req.params.id))[0];
        if (organ) {
            await organ.deleteOrgan();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getOrgan,
    getAllOrgans,
    createOrgan,
    deleteOrgan
};
