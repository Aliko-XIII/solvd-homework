const request = require('supertest');
const express = require('express');
const doctorRoutes = require('../../routes/doctorRoutes');
const userRoutes = require('../../routes/userRoutes');
const specializationRoutes = require('../../routes/specializationRoutes');
const { Doctor } = require('../../models/Doctor');
const { User } = require('../../models/User');
const { Specialization } = require('../../models/Specialization');

const app = express();
app.use(express.json());
app.use('/api/doctors', doctorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/specializations', specializationRoutes);

const userFields = {
    firstName: 'TestFirst',
    lastName: 'TestLast',
    phone: '444444444444',
    password: 'testpass',
    age: 25,
    sex: 'M',
};
const doctorFields = {
    patientLoad: 3,
    workdayStart: '09:05:00',
    workdayEnd: '18:30:00',
};
let doctorId = null;
let doctorProperties = [];

const specializationFields = {
    name: 'SpecializationName',
    description: 'Specialization description text',
};
let specializationId = null;

const testUser = new User(userFields.firstName, userFields.lastName, userFields.phone,
    userFields.password, userFields.age, userFields.sex);
const testSpecialization = new Specialization(specializationFields.name,
    specializationFields.description);
const testDoctor = new Doctor(testUser, testSpecialization, doctorFields.patientLoad,
    doctorFields.workdayStart, doctorFields.workdayEnd);
doctorPropertiesProperties = Object.getOwnPropertyNames(testDoctor).filter(prop =>
    typeof testDoctor[prop] !== 'function'
);

describe('POST /doctors', () => {
    test('should insert a doctor object to DB', async () => {
        const resUser = await request(app).post('/api/users').send({
            firstName: userFields.firstName,
            lastName: userFields.lastName,
            phone: userFields.phone,
            password: userFields.password,
            age: userFields.age,
            sex: userFields.sex
        });
        console.log('RESUSER:', resUser.body);
        expect(resUser.statusCode).toEqual(201);
        doctorId = resUser.body.id;
        const resSpecialization = await request(app).post('/api/specializations').send({
            name: specializationFields.name,
            description: specializationFields.description,
        });
        specializationId = resSpecialization.body.id;
        expect(resUser.body.id.length > 0).toBeTruthy();
        const resDoctor = await request(app).post('/api/doctors').send({
            userId: doctorId,
            specializationId: specializationId,
            patientLoad: doctorFields.patientLoad,
            workdayStart: doctorFields.workdayStart,
            workdayEnd: doctorFields.workdayEnd
        });
        expect(resDoctor.statusCode).toEqual(201);
        doctorProperties.forEach(prop => expect(resDoctor.body).toHaveProperty(prop));
    });

});

describe('GET /doctors', () => {
    test('should return an array of doctors', async () => {
        const res = await request(app).get('/api/doctors');
        expect(res.statusCode).toEqual(200);

        res.body.forEach(doctor => {
            doctorProperties.forEach(prop => expect(doctor).toHaveProperty(prop));
        });
    });
});

describe('DELETE /doctors/:id', () => {
    test('should delete a doctor from DB', async () => {
        const resDoctor = await request(app).delete('/api/doctors/' + doctorId);
        expect(resDoctor.statusCode).toEqual(204);
        const resSpecialization = await request(app).delete('/api/specializations/' + specializationId);
        const resUser = await request(app).delete('/api/users/' + doctorId);
    });
});


