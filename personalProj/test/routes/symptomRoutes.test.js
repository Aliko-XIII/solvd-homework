const request = require('supertest');
const express = require('express');
const symptomRoutes = require('../../routes/symptomRoutes');
const { Symptom } = require('../../models/Symptom');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/symptoms', symptomRoutes);

// Mock the Symptom model methods
jest.mock('../../models/Symptom');

describe('Symptom Routes', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Reset mock state after each test
    });

    describe('GET /symptoms', () => {
        test('should return all symptoms', async () => {
            const mockSymptoms = [{ id: 1, name: 'Headache', description: 'Pain in the head' }];
            Symptom.getSymptoms.mockResolvedValue(mockSymptoms); // Mock the getSymptoms method

            const response = await request(app).get('/symptoms');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSymptoms);
            expect(Symptom.getSymptoms).toHaveBeenCalledWith({ name: undefined, description: undefined });
        });

        test('should return a filtered list of symptoms', async () => {
            const mockSymptoms = [{ id: 1, name: 'Headache', description: 'Pain in the head' }];
            Symptom.getSymptoms.mockResolvedValue(mockSymptoms);

            const response = await request(app).get('/symptoms?name=Headache');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSymptoms);
            expect(Symptom.getSymptoms).toHaveBeenCalledWith({ name: 'Headache', description: undefined });
        });

        test('should handle errors in getting symptoms', async () => {
            Symptom.getSymptoms.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/symptoms');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /symptoms/:id', () => {
        test('should return a symptom by ID', async () => {
            const mockSymptom = { id: 1, name: 'Headache', description: 'Pain in the head' };
            Symptom.getSymptomById.mockResolvedValue(mockSymptom);

            const response = await request(app).get('/symptoms/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSymptom);
            expect(Symptom.getSymptomById).toHaveBeenCalledWith(1);
        });

        test('should return 404 if symptom not found', async () => {
            Symptom.getSymptomById.mockResolvedValue(null);

            const response = await request(app).get('/symptoms/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Symptom not found' });
        });

        test('should handle errors in getting symptom by ID', async () => {
            Symptom.getSymptomById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/symptoms/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

      describe('POST /symptoms', () => {
        test('should create a new symptom', async () => {
          const mockSymptom = { name: 'Headache', description: 'Pain in the head' };
          Symptom.prototype.insertSymptom.mockResolvedValue({ id: 1 });

          const response = await request(app).post('/symptoms').send(mockSymptom);

          expect(response.status).toBe(201);
          expect(Symptom.prototype.insertSymptom).toHaveBeenCalledTimes(1);
        });

        test('should handle errors in creating a symptom', async () => {
          const mockSymptom = { name: 'Headache', description: 'Pain in the head' };
          Symptom.prototype.insertSymptom.mockRejectedValue(new Error('Database error'));

          const response = await request(app).post('/symptoms').send(mockSymptom);
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ error: 'Database error' });
        });
      });

      describe('PUT /symptoms/:id', () => {
        test('should update a symptom by ID', async () => {
          const mockUpdatedSymptom = { name: 'Updated Headache', description: 'Updated description' };
          Symptom.updateSymptom.mockResolvedValue(mockUpdatedSymptom);

          const response = await request(app).put('/symptoms/1').send(mockUpdatedSymptom);
          expect(response.status).toBe(200);
          expect(response.body).toEqual(mockUpdatedSymptom);
          expect(Symptom.updateSymptom).toHaveBeenCalledWith(1, mockUpdatedSymptom);
        });

        test('should handle errors in updating a symptom', async () => {
          Symptom.updateSymptom.mockRejectedValue(new Error('Database error'));

          const response = await request(app).put('/symptoms/1').send({ name: 'Updated Headache' });
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ error: 'An error occurred while updating the symptom' });
        });
      });

    describe('DELETE /symptoms/:id', () => {
        test('should delete a symptom by ID', async () => {
            const mockSymptom = new Symptom('Headache', 'Pain in the head', 1);
            Symptom.getSymptomById.mockResolvedValue(mockSymptom); // Mock getting the symptom by ID
            Symptom.prototype.deleteSymptom.mockResolvedValue();
            const response = await request(app).delete('/symptoms/1');
            expect(response.status).toBe(204);
            expect(Symptom.getSymptomById).toHaveBeenCalledWith('1');
            expect(Symptom.prototype.deleteSymptom).toHaveBeenCalledTimes(1);
        });

        test('should return 404 if the symptom is not found', async () => {
            Symptom.getSymptomById.mockResolvedValue(null);

            const response = await request(app).delete('/symptoms/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Symptom not found' });
        });

        test('should handle errors in deleting a symptom', async () => {
            Symptom.getSymptomById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/symptoms/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

});
