const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');
const { User } = require('../models/User');
const { Specialization } = require('../models/Specialization');

const getDoctor = async (req, res) => {
    try {
        const doctor = (await Doctor.getDoctorsById(req.params.id))[0];
        res.status(200).send(doctor);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.getDoctors();
        res.status(200).send(doctors);
    } catch (err) {
        res.status(500).send(err);
    }
};

const createDoctor = async (req, res) => {
    try {
        const { specializationId, patientLoad, userId, workdayStart, workdayEnd } = req.body;
        const user = (await User.getUsersById(userId))[0];
        const specialization = (await Specialization.getSpecializationsById(specializationId))[0];
        const doctor = new Doctor(user, specialization);
        if (patientLoad) {
            doctor.patientLoad = patientLoad;
        }
        if(workdayStart){
            doctor.workdayStart=workdayStart;
        }
        if(workdayEnd){
            doctor.workdayEnd=workdayEnd;
        }
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

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.getDoctorAppointments(req.params.id);
        res.status(200).send({ appointments: appointments });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    getDoctor,
    createDoctor,
    deleteDoctor,
    getAllDoctors,
    getAppointments
}