const { Appointment } = require('../models/Appointment');
const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');

const getAppointment = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const nestDoctor = req.query.nestDoctor === 'true';
        const nestPatient = req.query.nestPatient === 'true';
        const appointment = (await Appointment.getAppointmentsByIds(
            [id], nestDoctor, nestPatient))[0];
        if (appointment) {
            res.status(200).send(appointment);
        } else {
            res.status(404).send({ error: 'Appointment not found' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const { patientId, doctorId, nestDoctor, nestPatient, startBefore, startAfter, endBefore, endAfter } = req.query;
        const appointments = await Appointment.getAppointments({
            patientId,
            doctorId,
            nestDoctor: nestDoctor === 'true',
            nestPatient: nestPatient === 'true',
            startBefore,
            startAfter,
            endBefore,
            endAfter
        });
        res.status(200).send(appointments);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);

        const { time, duration, description, patientId, doctorId } = req.body;

        if (!id) return res.status(400).json({ error: 'Appointment ID is required' });
        if (duration && typeof duration !== 'string') return res.status(400).json({ error: 'Invalid duration format' });
        if (patientId && typeof patientId !== 'string') res.status(400).json({ error: 'Invalid patient ID' });
        if (doctorId && typeof doctorId !== 'string') return res.status(400).json({ error: 'Invalid doctor ID' });
        const updates = { time, duration, description, patientId, doctorId };
        const hasParams = Object.values(updates).some(value => value !== undefined);
        if (!hasParams) return res.status(400).json({ error: 'No parameters to update' });

        const updated = await Appointment.updateAppointment(id, updates);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the appointment' });
    }
};

const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, time, duration, description } = req.body;
        const patient = (await Patient.getPatientsByIds([patientId]))[0];
        const doctor = (await Doctor.getDoctorsByIds([doctorId]))[0];
        const appointment = new Appointment(patient, doctor, time, duration, description);
        await appointment.insertAppointment();
        res.status(201).send(appointment);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id)
        const appointment = (await Appointment.getAppointmentsByIds([id]))[0];
        if (appointment) {
            await appointment.deleteAppointment();
            res.sendStatus(204);
        } else {
            res.status(404).send({ error: "Appointment not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    getAppointment,
    getAllAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
};
