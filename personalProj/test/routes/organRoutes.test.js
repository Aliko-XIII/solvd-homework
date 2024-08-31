const request = require('supertest');
const express = require('express');
const organRoutes = require('../../routes/organRoutes');
const { Organ } = require('../../models/Organ');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/organs', organRoutes);

// Mock the Organ model methods
jest.mock('../../models/Organ');

describe('Organ Routes', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Reset mock state after each test
    });

    describe('GET /organs', () => {
        test('should return all organs', async () => {
            const mockOrgans = [{ id: 1, name: 'Heart', description: 'Pumps blood throughout the body' }];
            Organ.getOrgans.mockResolvedValue(mockOrgans); // Mock the getOrgans method

            const response = await request(app).get('/organs');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrgans);
            expect(Organ.getOrgans).toHaveBeenCalledWith({ name: undefined, description: undefined });
        });

        test('should return a filtered list of organs', async () => {
            const mockOrgans = [{ id: 1, name: 'Heart', description: 'Pumps blood throughout the body' }];
            Organ.getOrgans.mockResolvedValue(mockOrgans);

            const response = await request(app).get('/organs?name=Heart');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrgans);
            expect(Organ.getOrgans).toHaveBeenCalledWith({ name: 'Heart', description: undefined });
        });

        test('should handle errors in getting organs', async () => {
            Organ.getOrgans.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/organs');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /organs/:id', () => {
        test('should return an organ by ID', async () => {
            const mockOrgan = { id: 1, name: 'Heart', description: 'Pumps blood throughout the body' };
            Organ.getOrganById.mockResolvedValue(mockOrgan);

            const response = await request(app).get('/organs/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrgan);
            expect(Organ.getOrganById).toHaveBeenCalledWith(1);
        });

        test('should return 404 if organ not found', async () => {
            Organ.getOrganById.mockResolvedValue(null);

            const response = await request(app).get('/organs/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Organ not found' });
        });

        test('should handle errors in getting organ by ID', async () => {
            Organ.getOrganById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/organs/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /organs', () => {
        test('should create a new organ', async () => {
            const mockOrgan = { name: 'Heart', description: 'Pumps blood throughout the body' };
            Organ.prototype.insertOrgan.mockResolvedValue({ id: 1 });

            const response = await request(app).post('/organs').send(mockOrgan);

            expect(response.status).toBe(201);
            expect(Organ.prototype.insertOrgan).toHaveBeenCalledTimes(1);
        });

        test('should handle errors in creating an organ', async () => {
            const mockOrgan = { name: 'Heart', description: 'Pumps blood throughout the body' };
            Organ.prototype.insertOrgan.mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/organs').send(mockOrgan);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('PUT /organs/:id', () => {
        test('should update an organ by ID', async () => {
            const mockUpdatedOrgan = { name: 'Updated Heart', description: 'Updated description' };
            Organ.updateOrgan.mockResolvedValue(mockUpdatedOrgan);

            const response = await request(app).put('/organs/1').send(mockUpdatedOrgan);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedOrgan);
            expect(Organ.updateOrgan).toHaveBeenCalledWith(1, mockUpdatedOrgan);
        });

        test('should handle errors in updating an organ', async () => {
            Organ.updateOrgan.mockRejectedValue(new Error('Database error'));

            const response = await request(app).put('/organs/1').send({ name: 'Updated Heart' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occurred while updating the organ' });
        });
    });

    describe('DELETE /organs/:id', () => {
        test('should delete an organ by ID', async () => {
            const mockOrgan = new Organ('Heart', 'Pumps blood throughout the body', 1);
            Organ.getOrganById.mockResolvedValue(mockOrgan); // Mock getting the organ by ID
            Organ.prototype.deleteOrgan.mockResolvedValue();
            const response = await request(app).delete('/organs/1');
            expect(response.status).toBe(204);
            expect(Organ.getOrganById).toHaveBeenCalledWith(1);
            expect(Organ.prototype.deleteOrgan).toHaveBeenCalledTimes(1);
        });

        test('should return 404 if the organ is not found', async () => {
            Organ.getOrganById.mockResolvedValue(null);

            const response = await request(app).delete('/organs/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Organ not found' });
        });

        test('should handle errors in deleting an organ', async () => {
            Organ.getOrganById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/organs/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

});
