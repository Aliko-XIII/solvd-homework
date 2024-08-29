const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const { User } = require('../../models/User');
const { query } = require('../../config/database');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

// Mock the User model methods
jest.mock('../../models/User');

describe('User Routes', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock state after each test
  });

  describe('GET /users', () => {
    test('should return all users', async () => {
      const mockUsers = [{ id: '1', firstName: 'John', lastName: 'Doe', age: 30 }];
      User.getUsers.mockResolvedValue(mockUsers); // Mock the getUsers method

      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(User.getUsers).toHaveBeenCalledTimes(1);
    });

    test('should return a filtered list of users', async () => {
      const mockUsers = [{ id: '1', firstName: 'John', lastName: 'Doe', age: 30 }];
      User.getUsers.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users?firstName=John');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(User.getUsers).toHaveBeenCalledWith({ firstName: 'John', lastName: undefined, minAge: undefined, maxAge: undefined, sex: undefined, phone: undefined });
    });

    test('should handle errors in getting users', async () => {
      User.getUsers.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /users/:id', () => {
    test('should return a user by ID', async () => {
      const mockUser = { id: '1', firstName: 'John', lastName: 'Doe', age: 30 };
      User.getUserById.mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(User.getUserById).toHaveBeenCalledWith('1');
    });

    test('should return 404 if user not found', async () => {
      User.getUserById.mockResolvedValue(null);

      const response = await request(app).get('/users/1');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'There is no such user found.' });
    });

    test('should handle errors in getting user by ID', async () => {
      User.getUserById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('POST /users', () => {
    test('should create a new user', async () => {
      const mockUser = {
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '1234567890',
        password: 'password',
        age: 25,
        sex: 'F',
      };
      User.prototype.insertUser = jest.fn().mockResolvedValue({ id: 'mocked-user-id' });
      const response = await request(app).post('/users').send(mockUser);
      expect(response.status).toBe(201);
      expect(User).toHaveBeenCalledWith(
        'Jane', 'Doe', '1234567890', 'password', 25, 'F'
      );
    });


    test('should handle errors in creating a user', async () => {
      const mockUser = { firstName: 'Jane', lastName: 'Doe', phone: '1234567890', password: 'password', age: 25, sex: 'F' };
      User.prototype.insertUser.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/users').send(mockUser);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('PUT /users/:id', () => {
    test('should update a user by ID', async () => {
      const mockUpdatedUser = { firstName: 'John', lastName: 'Doe', age: 30 };
      User.updateUser.mockResolvedValue(mockUpdatedUser);

      const response = await request(app).put('/users/1').send(mockUpdatedUser);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedUser);
      expect(User.updateUser).toHaveBeenCalledWith('1', mockUpdatedUser);
    });

    test('should handle errors in updating a user', async () => {
      User.updateUser.mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/users/1').send({ firstName: 'John' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while updating the user' });
    });
  });

  describe('DELETE /users/:id', () => {
    test('should delete a user by ID', async () => {
      User.getUserById.mockResolvedValue(new User('John', 'Doe', '123456789',
        'password', 30, 'M', '1'));
      User.prototype.deleteUser.mockResolvedValue();

      const response = await request(app).delete('/users/1');
      expect(response.status).toBe(204);
      expect(User.getUserById).toHaveBeenCalledWith('1');
      expect(User.prototype.deleteUser).toHaveBeenCalledTimes(1);
    });

    test('should return 404 if the user is not found', async () => {
      User.getUserById.mockResolvedValue(null);

      const response = await request(app).delete('/users/1');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found.' });
    });

    test('should handle errors in deleting a user', async () => {
      User.getUserById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/users/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

});
