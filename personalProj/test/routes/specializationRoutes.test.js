const request = require('supertest');
const express = require('express');
const specializationRoutes = require('../../routes/specializationRoutes');
const { Specialization } = require('../../models/Specialization');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/specializations', specializationRoutes);

// Mock the Specialization model methods
jest.mock('../../models/Specialization');

describe('Specialization Routes', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock state after each test
  });

  describe('GET /specializations', () => {
    test('should return all specializations', async () => {
      const mockSpecializations = [
        {
          id: 1,
          name: 'Cardiology',
          description: 'Heart-related treatments',
          symptoms: [{ id: 1, name: 'Chest Pain' }],
          organs: [{ id: 1, name: 'Heart' }],
        }
      ];
      Specialization.getSpecializations.mockResolvedValue(mockSpecializations);

      const response = await request(app).get('/specializations');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpecializations);
      expect(Specialization.getSpecializations).toHaveBeenCalledTimes(1);
    });

    test('should return filtered specializations', async () => {
      const mockSpecializations = [
        {
          id: 1,
          name: 'Cardiology',
          description: 'Heart-related treatments',
          symptoms: [{ id: 1, name: 'Chest Pain' }],
          organs: [{ id: 1, name: 'Heart' }],
        }
      ];
      Specialization.getSpecializations.mockResolvedValue(mockSpecializations);

      const response = await request(app).get('/specializations?name=Cardiology');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpecializations);
      expect(Specialization.getSpecializations).toHaveBeenCalledWith({ name: 'Cardiology', description: undefined, nestSymptoms: false, nestOrgans: false });
    });

    test('should handle errors in getting specializations', async () => {
      Specialization.getSpecializations.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/specializations');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /specializations/:id', () => {
    test('should return a specialization by ID', async () => {
      const mockSpecialization = {
        id: 1,
        name: 'Cardiology',
        description: 'Heart-related treatments',
        symptoms: [{ id: 1, name: 'Chest Pain' }],
        organs: [{ id: 1, name: 'Heart' }],
      };
      Specialization.getSpecializationById.mockResolvedValue(mockSpecialization);

      const response = await request(app).get('/specializations/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSpecialization);
      expect(Specialization.getSpecializationById).toHaveBeenCalledWith(1, false, false);
    });

    test('should return 404 if specialization not found', async () => {
      Specialization.getSpecializationById.mockResolvedValue(null);

      const response = await request(app).get('/specializations/1');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Specialization not found.' });
    });

    test('should handle errors in getting specialization by ID', async () => {
      Specialization.getSpecializationById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/specializations/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('POST /specializations', () => {
    test('should create a new specialization', async () => {
      const mockSpecializationData = {
        name: 'Neurology',
        description: 'Brain and nervous system treatments',
        symptoms: [],
        organs: []
      };

      Specialization.prototype.insertSpecialization = jest.fn().mockResolvedValue({ id: 'mocked-specialization-id' });

      const response = await request(app).post('/specializations').send(mockSpecializationData);
      expect(response.status).toBe(201);
      expect(Specialization).toHaveBeenCalledWith('Neurology', 'Brain and nervous system treatments', [], []);
    });

    test('should handle errors in creating a specialization', async () => {
      const mockSpecializationData = {
        name: 'Neurology',
        description: 'Brain and nervous system treatments',
      };
      Specialization.prototype.insertSpecialization.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/specializations').send(mockSpecializationData);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('PUT /specializations/:id', () => {
    test('should update a specialization by ID', async () => {
      const mockUpdatedSpecialization = {
        name: 'Cardiology',
        description: 'Updated description',
      };
      Specialization.updateSpecialization.mockResolvedValue(mockUpdatedSpecialization);

      const response = await request(app).put('/specializations/1').send(mockUpdatedSpecialization);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedSpecialization);
      expect(Specialization.updateSpecialization).toHaveBeenCalledWith(1, mockUpdatedSpecialization);
    });

    test('should handle errors in updating a specialization', async () => {
      Specialization.updateSpecialization.mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/specializations/1').send({ name: 'Neurology' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while updating the specialization' });
    });
  });

  describe('DELETE /specializations/:id', () => {
    test('should delete a specialization by ID', async () => {
      Specialization.getSpecializationById.mockResolvedValue(new Specialization('Neurology', 'Brain treatments', [], [], 1));
      Specialization.prototype.deleteSpecialization.mockResolvedValue();

      const response = await request(app).delete('/specializations/1');
      expect(response.status).toBe(204);
      expect(Specialization.getSpecializationById).toHaveBeenCalledWith(1);
      expect(Specialization.prototype.deleteSpecialization).toHaveBeenCalledTimes(1);
    });

    test('should return 404 if the specialization is not found', async () => {
      Specialization.getSpecializationById.mockResolvedValue(null);

      const response = await request(app).delete('/specializations/1');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Specialization not found.' });
    });

    test('should handle errors in deleting a specialization', async () => {
      Specialization.getSpecializationById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/specializations/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });
});
