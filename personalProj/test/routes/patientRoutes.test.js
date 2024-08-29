const request = require('supertest');
const express = require('express');
const patientRoutes = require('../../routes/patientRoutes');
const { Patient } = require('../../models/Patient');
const { User } = require('../../models/User');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/patients', patientRoutes);

// Mock the Patient model methods
jest.mock('../../models/Patient');
jest.mock('../../models/User');

describe('Patient Routes', () => {
  
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock state after each test
  });

  describe('GET /patients', () => {
    test('should return all patients', async () => {
      const mockPatients = [
        {
          user: { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
          insuranceNumber: 'INS123',
          insuranceProvider: 'HealthCorp',
        }
      ];
      Patient.getPatients.mockResolvedValue(mockPatients);

      const response = await request(app).get('/patients');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPatients);
      expect(Patient.getPatients).toHaveBeenCalledTimes(1);
    });

    test('should return filtered patients', async () => {
      const mockPatients = [
        {
          user: { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
          insuranceNumber: 'INS123',
          insuranceProvider: 'HealthCorp',
        }
      ];
      Patient.getPatients.mockResolvedValue(mockPatients);

      const response = await request(app).get('/patients?insuranceNumber=INS123');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPatients);
      expect(Patient.getPatients).toHaveBeenCalledWith({ insuranceNumber: 'INS123', insuranceProvider: undefined, nestUser: false });
    });

    test('should handle errors in getting patients', async () => {
      Patient.getPatients.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/patients');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /patients/:id', () => {
    test('should return a patient by ID', async () => {
      const mockPatient = {
        user: { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
        insuranceNumber: 'INS123',
        insuranceProvider: 'HealthCorp',
      };
      Patient.getPatientById.mockResolvedValue(mockPatient);

      const response = await request(app).get('/patients/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPatient);
      expect(Patient.getPatientById).toHaveBeenCalledWith('1', false);
    });

    test('should return 404 if patient not found', async () => {
      Patient.getPatientById.mockResolvedValue(null);

      const response = await request(app).get('/patients/1');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Patient not found' });
    });

    test('should handle errors in getting patient by ID', async () => {
      Patient.getPatientById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/patients/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('POST /patients', () => {
    test('should create a new patient', async () => {
      const mockPatientData = {
        insuranceNumber: 'INS123',
        insuranceProvider: 'HealthCorp',
        userId: '1'
      };

      Patient.prototype.insertPatient = jest.fn().mockResolvedValue({ id: 'mocked-patient-id' });
      Patient.getPatientById.mockResolvedValue();
      User.getUserById.mockResolvedValue({ id: '1' });

      const response = await request(app).post('/patients').send(mockPatientData);
      expect(response.status).toBe(201);
      expect(Patient).toHaveBeenCalledWith({ id: '1' }, 'INS123', 'HealthCorp');
    });

    test('should return 409 if patient already exists', async () => {
      const mockPatientData = {
        insuranceNumber: 'INS123',
        insuranceProvider: 'HealthCorp',
        userId: '1'
      };
      Patient.getPatientById.mockResolvedValue({ id: '1' });

      const response = await request(app).post('/patients').send(mockPatientData);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'There is already a patient record for this user.' });
    });

    test('should handle errors in creating a patient', async () => {
      const mockPatientData = {
        insuranceNumber: 'INS123',
        insuranceProvider: 'HealthCorp',
        userId: '1'
      };
      Patient.getPatientById.mockResolvedValue();
      Patient.prototype.insertPatient.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/patients').send(mockPatientData);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('PUT /patients/:id', () => {
    test('should update a patient by ID', async () => {
      const mockUpdatedPatient = {
        insuranceNumber: 'INS123',
        insuranceProvider: 'HealthCorp'
      };
      Patient.updatePatient.mockResolvedValue(mockUpdatedPatient);

      const response = await request(app).put('/patients/1').send(mockUpdatedPatient);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedPatient);
      expect(Patient.updatePatient).toHaveBeenCalledWith('1', mockUpdatedPatient);
    });

    test('should handle errors in updating a patient', async () => {
      Patient.updatePatient.mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/patients/1').send({ insuranceNumber: 'INS123' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occurred while updating the patient' });
    });
  });

  describe('DELETE /patients/:id', () => {
    test('should delete a patient by ID', async () => {
      Patient.getPatientById.mockResolvedValue(new Patient({ id: '1' }, 'INS123', 'HealthCorp'));
      Patient.prototype.deletePatient.mockResolvedValue();

      const response = await request(app).delete('/patients/1');
      expect(response.status).toBe(204);
      expect(Patient.getPatientById).toHaveBeenCalledWith('1');
      expect(Patient.prototype.deletePatient).toHaveBeenCalledTimes(1);
    });

    test('should return 404 if the patient is not found', async () => {
      Patient.getPatientById.mockResolvedValue(null);

      const response = await request(app).delete('/patients/1');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Patient not found.' });
    });

    test('should handle errors in deleting a patient', async () => {
      Patient.getPatientById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/patients/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });
});
