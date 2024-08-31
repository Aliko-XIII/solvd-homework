const request = require('supertest');
const express = require('express');
const authorizationRoutes = require('../../routes/authorizationRoutes');
const { User } = require('../../models/User');
const { query } = require('../../config/database');
const { createRefreshToken } = require('../../controllers/authorizationController');

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
                id: 'test-id',
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
            expect(User.getUserByPhone).toHaveBeenCalledWith(
                authData.phone
            );
            expect(User.getPassword).toHaveBeenCalledWith(
                mockUser.id
            );
        });
    });

    describe('POST /authorization/refresh', () => {
        test('should refresh user\'s access token successfully', async () => {
            const user = new User('name', 'lastname', '00000000', 'password', 26, 'M', 'test-id');
            const refreshToken = { refresh_token: createRefreshToken(user) };
            query.mockResolvedValue({ rows: [{ refresh_token: refreshToken.refresh_token }] });
            User.getUserById.mockResolvedValue(user);
            const response = await request(app).post('/authorization/refresh').send(refreshToken);
            expect(response.status).toBe(200);
            expect(typeof response.body.access_token).toBe('string');
            expect(response.body.access_token.length > 0).toBeTruthy();
        });
    });
});