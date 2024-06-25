const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');
const { User } = require('../models/User');
const { Specialization } = require('../models/Specialization');

const getDoctor = async (req, res) => {
    try {
        const doctor = (await Doctor.getDoctorsById(req.params.id))[0];
        console.log(doctor);
        res.status(200).send({ doctor: doctor });
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.getDoctors();
        res.status(200).send({ doctors: doctors });
    } catch (err) {
        res.status(500).send(err);
    }
};

const createDoctor = async (req, res) => {
    try {
        const { specializationId, maxLoad, userId } = req.body;
        const user = (await User.getUsersById(userId))[0];
        const specialization = (await Specialization.getSpecializationsById(specializationId))[0];
        const doctor = new Doctor(user, specialization, maxLoad);
        await doctor.insertDoctor();
        res.status(201).send(doctor);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctor = (await Doctor.getDoctorsById(req.params.id))[0];
        if (doctor) {
            await doctor.deleteDoctor();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getDoctor,
    createDoctor,
    deleteDoctor,
    getAllDoctors
}