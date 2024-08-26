const request = require('supertest');
const express = require('express');
const organRoutes = require('../../routes/organRoutes');
const symptomRoutes = require('../../routes/symptomRoutes');
const specializationRoutes = require('../../routes/specializationRoutes');
const { Organ } = require('../../models/Organ');
const { Symptom } = require('../../models/Symptom');
const { Specialization } = require('../../models/Specialization');

const app = express();
app.use(express.json());
app.use('/api/organs', organRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/specializations', specializationRoutes);

const organs = [
    {
        name: 'Heart',
        description: 'Pumps blood throughout the body.',
        id: null
    },
    {
        name: 'Lung',
        description: 'Proceeds oxygen for body.',
        id: null
    },
    {
        name: 'Kidney',
        description: 'Cleans blood for body.',
        id: null
    }
]

const symptoms = [
    {
        name: 'Headache',
        description: 'Pain in the head or upper neck.',
        id: null
    },
    {
        name: 'Fever',
        description: 'Body temperature above the normal range.',
        id: null
    },
    {
        name: 'Nausea',
        description: 'Feeling of sickness with an inclination to vomit.',
        id: null
    }
]

const specializationFields = {
    name: 'SpecializationName',
    description: 'Specialization description text',
};

let specializationId = null;
let specializationProperties = [];
const testSpecialization = new Specialization(specializationFields.name,
    specializationFields.description, symptoms, organs);
specializationProperties = Object.getOwnPropertyNames(testSpecialization).filter(
    prop => typeof testSpecialization[prop] !== 'function'
);

describe('POST /specializations', () => {
    test('should insert a specialization object to DB', async () => {
        for (const symptom of symptoms) {
            const resSymptom = await request(app).post('/api/symptoms').send({
                name: symptom.name,
                description: symptom.description,
            });
            symptom.id = resSymptom.body.id;
        }

        for (const organ of organs) {
            const resOrgan = await request(app).post('/api/organs').send({
                name: organ.name,
                description: organ.description,
            });
            organ.id = resOrgan.body.id;
        }
        const res = await request(app).post('/api/specializations').send({
            name: specializationFields.name,
            description: specializationFields.description,
            symptoms: symptoms,
            organs: organs
        });
        console.log(res.body);
        expect(res.statusCode).toEqual(201);
        specializationId = res.body.id;
        expect(res.body.id > 0).toBeTruthy();
        specializationProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

});

describe('GET /specializations', () => {
    test('should return an array of specializations', async () => {
        const res = await request(app).get('/api/specializations');
        expect(res.statusCode).toEqual(200);

        res.body.forEach(specialization => {
            specializationProperties.forEach(prop => expect(specialization).toHaveProperty(prop));
        });
    });

    test('should return an array of specializations with filter by insurance number', async () => {
        const res = await request(app).get('/api/specializations?name=e');
        expect(res.statusCode).toEqual(200);
        res.body.forEach(specialization => {
            specializationProperties.forEach(prop => expect(specialization).toHaveProperty(prop));
            expect(specialization.name.toLowerCase().indexOf('e') !== -1).toBeTruthy();
        });
    });
});

describe('GET /specializations/:id', () => {
    test('should return a specialization from DB', async () => {
        const res = await request(app).get('/api/specializations/' + specializationId);
        expect(res.statusCode).toEqual(200);
        Object.keys(specializationFields).forEach(key => expect(res.body[key]).toEqual(specializationFields[key]));
        specializationProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 500 status for invalid specialization id', async () => {
        const res = await request(app).get('/api/specializations/'+'badId');
        expect(res.statusCode).toEqual(500);
    });
});

describe('UPDATE /specializations/:id', () => {
    test('should update a specialization in DB', async () => {
        const res = await request(app).put('/api/specializations/' + specializationId).send({
            name: 'NewName'
        });;
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('NewName');
        specializationProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 400 status for invalid field value', async () => {
        const res = await request(app).put('/api/specializations/' + specializationId).send({
            description: 123
        });;
        expect(res.statusCode).toEqual(400);
    });
});


describe('DELETE /specializations/:id', () => {
    test('should delete a specialization from DB', async () => {
        for (const symptom of symptoms) {
            await request(app).delete('/api/symptoms/' + symptom.id);
        }
        for (const organ of organs) {
            await request(app).delete('/api/organs/' + organ.id);
        }
        const res = await request(app).delete('/api/specializations/' + specializationId);
        expect(res.statusCode).toEqual(204);
    });
});
