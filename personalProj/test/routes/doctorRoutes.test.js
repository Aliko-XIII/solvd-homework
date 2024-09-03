const request = require('supertest');
const express = require('express');
const doctorRoutes = require('../../routes/doctorRoutes');
const { Doctor } = require('../../models/Doctor');
const { User } = require('../../models/User');
const { Specialization } = require('../../models/Specialization');
const { Appointment } = require('../../models/Appointment');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/doctors', doctorRoutes);

// Mock the Doctor, User, and Specialization models
jest.mock('../../models/Doctor');
jest.mock('../../models/User');
jest.mock('../../models/Specialization');
jest.mock('../../models/Appointment');

describe('Doctor Routes', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Reset mock state after each test
    });

    describe('GET /doctors', () => {
        test('should return all doctors', async () => {
            const mockDoctors = [
                {
                    user: { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
                    specialization: { id: 2, name: 'Cardiology' },
                    workdayStart: '08:00:00',
                    workdayEnd: '17:00:00',
                    patientLoad: 20,
                }
            ];
            Doctor.getDoctors.mockResolvedValue(mockDoctors);

            const response = await request(app).get('/doctors');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDoctors);
            expect(Doctor.getDoctors).toHaveBeenCalledTimes(1);
        });

        test('should return filtered doctors', async () => {
            const mockDoctors = [
                {
                    user: { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
                    specialization: { id: 2, name: 'Cardiology' },
                    workdayStart: '08:00:00',
                    workdayEnd: '17:00:00',
                    patientLoad: 20,
                }
            ];
            Doctor.getDoctors.mockResolvedValue(mockDoctors);

            const response = await request(app).get('/doctors?specializationId=2');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDoctors);
            expect(Doctor.getDoctors).toHaveBeenCalledWith({ specializationId: 2, nestUser: false, nestSpecialization: false });
        });

        test('should handle errors in getting doctors', async () => {
            Doctor.getDoctors.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/doctors');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /doctors/:id', () => {
        test('should return a doctor by ID', async () => {
            const mockDoctor = {
                user: { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
                specialization: { id: 2, name: 'Cardiology' },
                workdayStart: '08:00:00',
                workdayEnd: '17:00:00',
                patientLoad: 20,
            };
            Doctor.getDoctorsByIds.mockResolvedValue([mockDoctor]);

            const response = await request(app).get('/doctors/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDoctor);
            expect(Doctor.getDoctorsByIds).toHaveBeenCalledWith(['1'], false, false);
        });

        test('should return 404 if doctor not found', async () => {
            Doctor.getDoctorsByIds.mockResolvedValue([]);

            const response = await request(app).get('/doctors/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Doctor not found.' });
        });

        test('should handle errors in getting doctor by ID', async () => {
            Doctor.getDoctorsByIds.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/doctors/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /doctors', () => {
        test('should create a new doctor', async () => {
            const mockDoctorData = {
                specializationId: 2,
                patientLoad: 20,
                userId: '1',
                workdayStart: '08:00:00',
                workdayEnd: '17:00:00'
            };

            User.getUserById.mockResolvedValue({ id: '1' });
            Specialization.getSpecializationsByIds.mockResolvedValue([{ id: 2, name: 'Cardiology' }]);
            Doctor.prototype.insertDoctor = jest.fn().mockResolvedValue({ id: 'mocked-doctor-id' });

            const response = await request(app).post('/doctors').send(mockDoctorData);
            expect(response.status).toBe(201);
            expect(Doctor.prototype.insertDoctor).toHaveBeenCalled();
        });

        test('should return 400 if required data is missing', async () => {
            const mockDoctorData = {
                specializationId: 2,
                patientLoad: 20
            };

            const response = await request(app).post('/doctors').send(mockDoctorData);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'User ID is required' });
        });

        test('should handle errors in creating a doctor', async () => {
            const mockDoctorData = {
                specializationId: 2,
                patientLoad: 20,
                userId: '1'
            };

            User.getUserById.mockResolvedValue({ id: '1' });
            Specialization.getSpecializationsByIds.mockResolvedValue([{ id: 2, name: 'Cardiology' }]);
            Doctor.prototype.insertDoctor.mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/doctors').send(mockDoctorData);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('PUT /doctors/:id', () => {
        test('should update a doctor by ID', async () => {
            const mockUpdatedDoctor = {
                user: { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
                specialization: { id: 2, name: 'Cardiology' },
                workdayStart: '09:00:00',
                workdayEnd: '18:00:00',
                patientLoad: 25,
            };
            Doctor.updateDoctor.mockResolvedValue(mockUpdatedDoctor);

            const response = await request(app).put('/doctors/1').send({
                specializationId: 2,
                patientLoad: 25,
                workdayStart: '09:00:00',
                workdayEnd: '18:00:00'
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedDoctor);
            expect(Doctor.updateDoctor).toHaveBeenCalledWith('1', {
                specializationId: 2,
                patientLoad: 25,
                workdayStart: '09:00:00',
                workdayEnd: '18:00:00'
            });
        });

        test('should return 400 if no parameters are provided', async () => {
            const response = await request(app).put('/doctors/1').send({});
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'No parameters to update' });
        });

        test('should handle errors in updating a doctor', async () => {
            Doctor.updateDoctor.mockRejectedValue(new Error('Database error'));

            const response = await request(app).put('/doctors/1').send({ patientLoad: 25 });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'An error occurred while updating the doctor' });
        });
    });

    describe('DELETE /doctors/:id', () => {
        test('should delete a doctor by ID', async () => {
            Doctor.getDoctorsByIds.mockResolvedValue([new Doctor({ id: '1' })]);
            Doctor.prototype.deleteDoctor.mockResolvedValue();

            const response = await request(app).delete('/doctors/1');
            expect(response.status).toBe(204);
            expect(Doctor.getDoctorsByIds).toHaveBeenCalledWith(['1']);
            expect(Doctor.prototype.deleteDoctor).toHaveBeenCalledTimes(1);
        });

        test('should return 404 if doctor is not found', async () => {
            Doctor.getDoctorsByIds.mockResolvedValue([]);

            const response = await request(app).delete('/doctors/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Doctor not found.' });
        });

        test('should handle errors in deleting a doctor', async () => {
            Doctor.getDoctorsByIds.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/doctors/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /doctors/:id/appointments', () => {
        test('should return appointments for a doctor by ID', async () => {
            const mockAppointments = [
                {
                    id: 1,
                    patientId: '2',
                    doctorId:'3',
                    date: '2024-08-30T10:00:00Z',
                    duration: '01:00:00',
                },
            ];
            Appointment.getAppointments.mockResolvedValue(mockAppointments);

            const response = await request(app).get('/doctors/1/appointments');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAppointments);
        });

        test('should handle errors in getting doctor appointments', async () => {
            Appointment.getAppointments.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/doctors/1/appointments');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });
});
