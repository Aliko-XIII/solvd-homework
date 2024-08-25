const request = require('supertest');
const express = require('express');
const symptomRoutes = require('../../routes/symptomRoutes');
const { Symptom } = require('../../models/Symptom');

const app = express();
app.use(express.json());
app.use('/api/symptoms', symptomRoutes);

const symptomFields = {
    name: 'Headache',
    description: 'A continuous pain in the head.',
};
let symptomId = null;
let symptomProperties = [];

const testSymptom = new Symptom(symptomFields.name, symptomFields.description);
symptomProperties = Object.getOwnPropertyNames(testSymptom).filter(prop =>
    typeof testSymptom[prop] !== 'function');

describe('POST /symptoms', () => {
    test('should insert a symptom object to DB', async () => {
        const res = await request(app).post('/api/symptoms').send({
            name: symptomFields.name,
            description: symptomFields.description
        });
        expect(res.statusCode).toEqual(201);
        symptomId = res.body.id;
        expect(res.body.id > 0).toBeTruthy();
        symptomProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

});

describe('GET /symptoms', () => {
    test('should return an array of symptoms', async () => {
        const res = await request(app).get('/api/symptoms');
        expect(res.statusCode).toEqual(200);

        res.body.forEach(symptom =>
            symptomProperties.forEach(prop => expect(symptom).toHaveProperty(prop)));
    });

    test('should return an array of symptoms with filter by name', async () => {
        const res = await request(app).get('/api/symptoms?name=a');
        expect(res.statusCode).toEqual(200);
        res.body.forEach(symptom => {
            symptomProperties.forEach(prop => expect(symptom).toHaveProperty(prop));
            expect(symptom.name.indexOf('a')).toBeTruthy();
        });
    });
});

describe('GET /symptoms/:id', () => {
    test('should return a symptom from DB', async () => {
        const res = await request(app).get('/api/symptoms/' + symptomId);
        expect(res.statusCode).toEqual(200);
        Object.keys(symptomFields).forEach(key => expect(res.body[key]).toEqual(symptomFields[key]));
        symptomProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 500 status for invalid symptom id', async () => {
        const res = await request(app).get('/api/symptoms/' + 'badId');
        expect(res.statusCode).toEqual(500);
    });
});

describe('UPDATE /symptoms/:id', () => {
    test('should update a symptom in DB', async () => {
        const res = await request(app).put('/api/symptoms/' + symptomId).send({
            name: 'newName',
            description: 'newDescription'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('newName');
        expect(res.body.description).toEqual('newDescription');
        symptomProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 400 status for invalid field value', async () => {
        const res = await request(app).put('/api/symptoms/' + symptomId).send({
            name: ''
        });
        expect(res.statusCode).toEqual(400);
    });
});

describe('DELETE /symptoms/:id', () => {
    test('should delete a symptom from DB', async () => {
        const res = await request(app).delete('/api/symptoms/' + symptomId);
        expect(res.statusCode).toEqual(204);
    });
});