const { Appointment } = require('../models/Appointment');
const { Doctor } = require('../models/Doctor');
const { User } = require('../models/User');
const { Specialization } = require('../models/Specialization');

const getDoctor = async (req, res) => {
    try {
        const nestUser = req.query.nestUser === 'true';
        const nestSpecialization = req.query.nestSpecialization === 'true';
        nestSpecialization
        const doctor = (await Doctor.getDoctorsByIds([req.params.id], nestUser, nestSpecialization))[0];
        if (doctor) {
            res.status(200).send(doctor);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const { nestUser = false, nestSpecialization = false } = req.query;
        const doctors = await Doctor.getDoctors(nestUser, nestSpecialization);
        res.status(200).send(doctors);
    } catch (err) {
        res.status(500).send(err);
    }
};

const createDoctor = async (req, res) => {
    try {
        const { specializationId, patientLoad, userId, workdayStart, workdayEnd } = req.body;
        const user = await User.getUserById(userId);
        const specialization = (await Specialization.getSpecializationsByIds([specializationId]))[0];
        const doctor = new Doctor(user, specialization);
        if (patientLoad) doctor.patientLoad = patientLoad;
        if (workdayStart) doctor.workdayStart = workdayStart;
        if (workdayEnd) doctor.workdayEnd = workdayEnd;
        const id = await doctor.insertDoctor();
        res.status(201).send(id);
    } catch (err) {
        res.status(500).send(err);
    }
};

const updateDoctor = async (req, res) => {
    try {
        const userId = req.params.id;
        let { specializationId, patientLoad, workdayStart, workdayEnd } = req.body;
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        const updates = { specializationId, patientLoad, workdayStart, workdayEnd };
        const hasParams = Object.values(updates).some(value => value !== undefined);
        if (!hasParams) return res.status(400).json({ error: 'No parameters to update' });

        const updated = await Doctor.updateDoctor(userId, updates);
        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the doctor' });
    }
};


const deleteDoctor = async (req, res) => {
    try {
        const doctor = (await Doctor.getDoctorsByIds([req.params.id]))[0];
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
        res.status(200).send(appointments);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    getDoctor,
    createDoctor,
    deleteDoctor,
    getAllDoctors,
    updateDoctor,
    getAppointments
}
