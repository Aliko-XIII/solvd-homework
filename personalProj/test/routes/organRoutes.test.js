const request = require('supertest');
const express = require('express');
const organRoutes = require('../../routes/organRoutes');
const { Organ } = require('../../models/Organ');

const app = express();
app.use(express.json());
app.use('/api/organs', organRoutes);

const organFields = {
    name: 'Heart',
    description: 'An organ to pump blood through body.',
};
let organId = null;
let organProperties = [];

describe('POST /organs', () => {
    test('should insert a organ object to DB', async () => {
        const res = await request(app).post('/api/organs').send({
            name: organFields.name,
            description: organFields.description
        });
        expect(res.statusCode).toEqual(201);
        organId = res.body.id;
        expect(res.body.id > 0).toBeTruthy();
        organProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

});

describe('GET /organs', () => {
    const testOrgan = new Organ(organFields.name, organFields.description);
    organProperties = Object.getOwnPropertyNames(testOrgan).filter(prop =>
        typeof testOrgan[prop] !== 'function');
    test('should return an array of organs', async () => {
        const res = await request(app).get('/api/organs');
        expect(res.statusCode).toEqual(200);

        res.body.forEach(organ => {
            organProperties.forEach(prop => expect(organ).toHaveProperty(prop));
        });
    });

    test('should return an array of organs with filter by name', async () => {
        const res = await request(app).get('/api/organs?name=a');
        expect(res.statusCode).toEqual(200);
        res.body.forEach(organ => {
            organProperties.forEach(prop => expect(organ).toHaveProperty(prop));
            expect(organ.name.indexOf('a')).toBeTruthy();
        });
    });
});

describe('GET /organs/:id', () => {
    test('should return a organ from DB', async () => {
        const res = await request(app).get('/api/organs/' + organId);
        expect(res.statusCode).toEqual(200);
        Object.keys(organFields).forEach(key => expect(res.body[key]).toEqual(organFields[key]));
        organProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 500 status for invalid organ id', async () => {
        const res = await request(app).get('/api/organs/'+'badId');
        expect(res.statusCode).toEqual(500);
    });
});

describe('UPDATE /organs/:id', () => {
    test('should update a organ in DB', async () => {
        const res = await request(app).put('/api/organs/' + organId).send({
            name: 'newName',
            description: 'newDescription'
        });;
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('newName');
        expect(res.body.description).toEqual('newDescription');
        organProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 400 status for invalid field value', async () => {
        const res = await request(app).put('/api/organs/' + organId).send({
            name: ''
        });;
        expect(res.statusCode).toEqual(400);
    });
});

describe('DELETE /organs/:id', () => {
    test('should delete a organ from DB', async () => {
        const res = await request(app).delete('/api/organs/' + organId);
        expect(res.statusCode).toEqual(204);
    });
});