const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const { User } = require('../../models/User');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

const userFields = {
    firstName: 'TestFirst',
    lastName: 'TestLast',
    phone: '0000000000',
    password: 'testpass',
    age: 25,
    sex: 'M',
};
let userId = null;
let userProperties = [];
const testUser = new User(userFields.firstName, userFields.lastName, userFields.phone,
    userFields.password, userFields.age, userFields.sex);
Object.getOwnPropertyNames(testUser).filter(prop => {
    if (typeof testUser[prop] !== 'function' && prop !== 'password')
        userProperties.push(prop);
});

describe('POST /users', () => {
    test('should insert a user object to DB', async () => {
        const res = await request(app).post('/api/users').send({
            firstName: userFields.firstName,
            lastName: userFields.lastName,
            phone: userFields.phone,
            password: userFields.password,
            age: userFields.age,
            sex: userFields.sex
        });
        expect(res.statusCode).toEqual(201);
        userId = res.body.id;
        expect(res.body.id.length > 0).toBeTruthy();
        userProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

});

describe('GET /users', () => {
    test('should return an array of users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toEqual(200);
        res.body.forEach(user =>
            userProperties.forEach(prop => expect(user).toHaveProperty(prop)));
    });

    test('should return an array of users with filter by sex', async () => {
        const res = await request(app).get('/api/users?sex=M');
        expect(res.statusCode).toEqual(200);
        res.body.forEach(user => {
            userProperties.forEach(prop => expect(user).toHaveProperty(prop));
            expect(user.sex).toEqual('M');
        });
    });
    test('should return an array of users with filter by sex', async () => {
        const res = await request(app).get('/api/users?minAge=20&maxAge=40');
        expect(res.statusCode).toEqual(200);
        res.body.forEach(user => {
            userProperties.forEach(prop => expect(user).toHaveProperty(prop));
            expect(user.age >= 20 && user.age <= 40).toBeTruthy();
        });
    });
});

describe('GET /users/:id', () => {
    test('should return a user from DB', async () => {
        const res = await request(app).get('/api/users/' + userId);
        expect(res.statusCode).toEqual(200);
        Object.keys(userFields).forEach(key => {
            if (key !== 'password') expect(res.body[key]).toEqual(userFields[key])
        });
        userProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 500 status for invalid user id', async () => {
        const res = await request(app).get('/api/users/' + 'badId');
        expect(res.statusCode).toEqual(500);
    });
});

describe('UPDATE /users/:id', () => {
    test('should update a user in DB', async () => {
        const res = await request(app).put('/api/users/' + userId).send({
            firstName: 'NewFirst',
            age: 26,
            sex: 'F'
        });;
        expect(res.statusCode).toEqual(200);
        expect(res.body.firstName).toEqual('NewFirst');
        expect(res.body.age).toEqual(26);
        expect(res.body.sex).toEqual('F');
        userProperties.forEach(prop => expect(res.body).toHaveProperty(prop));
    });

    test('should return 400 status for invalid field value', async () => {
        const res = await request(app).put('/api/users/' + userId).send({
            sex: 'INVALID'
        });;
        expect(res.statusCode).toEqual(400);
    });
});

describe('DELETE /users/:id', () => {
    test('should delete a user from DB', async () => {
        const res = await request(app).delete('/api/users/' + userId);
        expect(res.statusCode).toEqual(204);
    });
});