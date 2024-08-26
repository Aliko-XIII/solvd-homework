const request = require('supertest');
const express = require('express');

const userRoutes = require('../../routes/userRoutes');
const doctorRoutes = require('../../routes/doctorRoutes');
const patientRoutes = require('../../routes/patientRoutes');
const specializationRoutes = require('../../routes/specializationRoutes');
const appointmentRoutes = require('../../routes/appointmentRoutes');

const { User } = require('../../models/User');
const { Specialization } = require('../../models/Specialization');
const { Doctor } = require('../../models/Doctor');
const { Patient } = require('../../models/Patient');
const { Appointment } = require('../../models/Appointment');

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/appointments', appointmentRoutes);

const userFields = {
    firstName: 'TestFirst',
    lastName: 'TestLast',
    phone1: '9999999999',
    phone2: '7777777777',
    password: 'testpass',
    age: 25,
    sex: 'M',
};
const patientFields = {
    insuranceNumber: 'testnumber',
    insuranceProvider: 'testprovider',
};
const doctorFields = {
    patientLoad: 3,
    workdayStart: '09:05:00',
    workdayEnd: '18:30:00',
};
const specializationFields = {
    name: 'SpecializationName',
    description: 'Specialization description text',
};
const appointmentFields = {
    patient: null,
    doctor: null,
    time: '2024-09-18 10:00:00',
    duration: '00:30:00',
    description: 'text details for the appointment'
};
let patientId = null;
let doctorId = null;
let specializationId = null;
let appointmentId = null;
let appointmentProperties = [];

describe('GET /appointments', () => {
    const testUser1 = new User(userFields.firstName, userFields.lastName, userFields.phone1,
        userFields.password, userFields.age, userFields.sex);
    const testSpecialization = new Specialization(specializationFields.name,
        specializationFields.description);
    const testDoctor = new Doctor(testUser1, testSpecialization, doctorFields.patientLoad,
        doctorFields.workdayStart, doctorFields.workdayEnd);
    const testUser2 = new User(userFields.firstName, userFields.lastName, userFields.phone2,
        userFields.password, userFields.age, userFields.sex);
    const testPatient = new Patient(testUser2, patientFields.insuranceNumber,
        patientFields.insuranceProvider);
    const testAppointments = new Appointment(testPatient, testDoctor, appointmentFields.time,
        appointmentFields.duration, appointmentFields.description);
    appointmentProperties = Object.getOwnPropertyNames(testAppointments).filter(prop =>
        typeof testAppointments[prop] !== 'function');
    test('should return an array of appointments', async () => {
        const res = await request(app).get('/api/appointments');
        expect(res.statusCode).toEqual(200);

        res.body.forEach(appointment => {
            appointmentProperties.forEach(prop => expect(appointment).toHaveProperty(prop));
        });
    });
});

describe('POST /appointments', () => {
    test('should insert a doctor object to DB', async () => {

        const resUser1 = await request(app).post('/api/users').send({
            firstName: userFields.firstName,
            lastName: userFields.lastName,
            phone: userFields.phone1,
            password: userFields.password,
            age: userFields.age,
            sex: userFields.sex
        });
        doctorId = resUser1.body.id;

        const resSpecialization = await request(app).post('/api/specializations').send({
            name: specializationFields.name,
            description: specializationFields.description,
        });
        specializationId = resSpecialization.body.id;

        const resDoctor = await request(app).post('/api/doctors').send({
            userId: doctorId,
            specializationId: specializationId,
            patientLoad: doctorFields.patientLoad,
            workdayStart: doctorFields.workdayStart,
            workdayEnd: doctorFields.workdayEnd
        });

        const resUser2 = await request(app).post('/api/users').send({
            firstName: userFields.firstName,
            lastName: userFields.lastName,
            phone: userFields.phone2,
            password: userFields.password,
            age: userFields.age,
            sex: userFields.sex
        });
        patientId = resUser2.body.id;

        const resPatient = await request(app).post('/api/patients').send({
            userId: patientId,
            insuranceNumber: patientFields.insuranceNumber,
            insuranceProvider: patientFields.insuranceProvider
        });
        expect(resUser1.statusCode).toEqual(201);
        expect(resSpecialization.statusCode).toEqual(201);
        expect(resDoctor.statusCode).toEqual(201);
        expect(resUser2.statusCode).toEqual(201);
        expect(resPatient.statusCode).toEqual(201);

        const resAppointment = await request(app).post('/api/appointments').send({
            patientId: patientId,
            doctorId: doctorId,
            time: appointmentFields.time,
            duration: appointmentFields.duration,
            description: appointmentFields.description
        });
        expect(resAppointment.statusCode).toEqual(201);
        appointmentId = resAppointment.body.id;
        appointmentProperties.forEach(prop => expect(resAppointment.body).toHaveProperty(prop));
    });
});


describe('DELETE /appointments/:id', () => {
    test('should delete an appointment from DB', async () => {
        await request(app).delete('/api/doctors/' + doctorId);
        await request(app).delete('/api/specializations/' + specializationId);
        await request(app).delete('/api/users/' + doctorId);
        await request(app).delete('/api/patients/' + patientId);
        await request(app).delete('/api/users/' + patientId);
        const res = await request(app).delete('/api/appointments/' + appointmentId);
        expect(res.statusCode).toEqual(204);
    });
});



