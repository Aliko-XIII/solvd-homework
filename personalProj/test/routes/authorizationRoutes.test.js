const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const authorizationRoutes = require('../../routes/authorizationRoutes');
const { User } = require('../../models/User');
const { query } = require('../../config/database');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/authorization', authorizationRoutes);


// Mock the query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));
// Mock the User model methods
jest.mock('../../models/User');

describe('Appointment Routes', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset mock state after each test
    });

    describe('POST /authorization/login', () => {
        test('should login user successfully', async () => {
            const authData = {
                phone: '1234567890',
                password: 'password',
            };
            const mockUser = {
                firstName: 'Jane',
                lastName: 'Doe',
                phone: '1234567890',
                age: 25,
                sex: 'F',
            }
            User.getUserByPhone.mockResolvedValue(mockUser);
            User.getPassword.mockResolvedValue('password');
            query.mockResolvedValue();
            const response = await request(app).post('/authorization/login').send(authData);
            expect(response.status).toBe(200);
        });
    });
});