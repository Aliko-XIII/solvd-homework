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
            res.status(404).send({ error: "Doctor not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
};

const getAllDoctors = async (req, res) => {
    try {
        const { specializationId, nestUser = false, nestSpecialization = false } = req.query;
        const doctors = await Doctor.getDoctors({
            specializationId: Number.parseInt(specializationId),
            nestUser, nestSpecialization
        });
        res.status(200).send(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
};

const createDoctor = async (req, res) => {
    try {
        const { specializationId, patientLoad, userId, workdayStart, workdayEnd } = req.body;
        if (!userId || !specializationId) return res.status(400).send({ error: 'User ID is required' });
        const user = await User.getUserById(userId);
        const specialization = await Specialization.getSpecializationById(specializationId);
        const doctor = new Doctor(user, specialization);
        if (patientLoad) doctor.patientLoad = patientLoad;
        if (workdayStart) doctor.workdayStart = workdayStart;
        if (workdayEnd) doctor.workdayEnd = workdayEnd;
        await doctor.insertDoctor();
        res.status(201).send(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });

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
            res.status(404).json({ error: 'Doctor not found.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.getDoctorAppointments(req.params.id);
        res.status(200).send(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });

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
