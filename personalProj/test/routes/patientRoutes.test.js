const request = require('supertest');
const express = require('express');
const patientRoutes = require('../../routes/patientRoutes');
const userRoutes = require('../../routes/userRoutes');
const { User } = require('../../models/User');
const { Patient } = require('../../models/Patient');

const app = express();
app.use(express.json());
app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);

const userFields = {
    firstName: 'TestFirst',
    lastName: 'TestLast',
    phone: '33333333333',
    password: 'testpass',
    age: 25,
    sex: 'M',
};
const patientFields = {
    insuranceNumber: 'testnumber',
    insuranceProvider: 'testprovider',
};
let patientId = null;
let patientProperties = [];
const testUser = new User(userFields.firstName, userFields.lastName, userFields.phone,
    userFields.password, userFields.age, userFields.sex);
const testPatient = new Patient(testUser, patientFields.insuranceNumber,
    patientFields.insuranceProvider)
patientProperties = Object.getOwnPropertyNames(testPatient).filter(prop =>
    typeof testPatient[prop] !== 'function'
);

describe('POST /patients', () => {
    test('should insert a patient object to DB', async () => {
        const resUser = await request(app).post('/api/users').send({
            firstName: userFields.firstName,
            lastName: userFields.lastName,
            phone: userFields.phone,
            password: userFields.password,
            age: userFields.age,
            sex: userFields.sex
        });
        expect(resUser.statusCode).toEqual(201);
        patientId = resUser.body.id;
        expect(resUser.body.id.length > 0).toBeTruthy();
        const resPatient = await request(app).post('/api/patients').send({
            userId: patientId,
            insuranceNumber: patientFields.insuranceNumber,
            insuranceProvider: patientFields.insuranceProvider
        });
        console.log(resPatient.body);
        expect(resPatient.statusCode).toEqual(201);
        patientProperties.forEach(prop => expect(resPatient.body).toHaveProperty(prop));
    });

});

describe('GET /patients', () => {
    test('should return an array of patients', async () => {
        const res = await request(app).get('/api/patients');
        expect(res.statusCode).toEqual(200);

        res.body.forEach(patient => {
            patientProperties.forEach(prop => expect(patient).toHaveProperty(prop));
        });
    });

    test('should return an array of users with filter by insurance number', async () => {
        const res = await request(app).get('/api/patients?insuranceNumber=e');
        expect(res.statusCode).toEqual(200);
        res.body.forEach(patient => {
            patientProperties.forEach(prop => expect(patient).toHaveProperty(prop));
            expect(patient.insuranceNumber.indexOf('e') !== -1).toBeTruthy();
        });
    });
});


describe('DELETE /patients/:id', () => {
    test('should delete a patient from DB', async () => {
        const resPatient = await request(app).delete('/api/patients/' + patientId);
        expect(resPatient.statusCode).toEqual(204);
        const resUser = await request(app).delete('/api/users/' + patientId);
    });
});