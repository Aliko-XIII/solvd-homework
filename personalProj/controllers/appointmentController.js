const { Appointment } = require('../models/Appointment');
const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');

const getAppointment = async (req, res) => {
    try {
        const nestDoctor = req.query.nestDoctor === 'true';
        const nestPatient = req.query.nestPatient === 'true';
        const appointment = (await Appointment.getAppointmentsById([req.params.id], nestDoctor, nestPatient))[0];
        if (appointment) {
            res.status(200).send(appointment);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
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
        res.status(500).send(err);
    }
};

const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, time, duration, description } = req.body;
        const patient = (await Patient.getPatientsByIds(false, patientId))[0];
        const doctor = (await Doctor.getDoctorsById(doctorId))[0];
        const appointment = new Appointment(patient, doctor, time, duration, description);
        await appointment.insertAppointment();
        res.status(201).send(appointment);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const appointment = (await Appointment.getAppointmentsById([req.params.id]))[0];
        if (appointment) {
            await appointment.deleteAppointment();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getAppointment,
    getAllAppointments,
    createAppointment,
    deleteAppointment
};
