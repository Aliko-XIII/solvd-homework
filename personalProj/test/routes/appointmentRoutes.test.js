const request = require('supertest');
const express = require('express');
const appointmentRoutes = require('../../routes/appointmentRoutes');
const { User } = require('../../models/User');
const { Patient } = require('../../models/Patient');
const { Doctor } = require('../../models/Doctor');
const { Appointment } = require('../../models/Appointment');

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/appointments', appointmentRoutes);

// Mock the model methods
jest.mock('../../models/Appointment');
jest.mock('../../models/User');
jest.mock('../../models/Specialization');
jest.mock('../../models/Doctor');
jest.mock('../../models/Patient');

describe('Appointment Routes', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset mock state after each test
    });

    describe('GET /appointments', () => {
        test('should return all appointments', async () => {
            const mockAppointments = [
                {
                    id: '1',
                    doctor: { user: { id: '10' } },
                    patient: { user: { id: '20' } },
                    time: '18.08.2024 13:15:00',
                    duration: '01:35:00',
                }
            ];
            Appointment.getAppointments.mockResolvedValue(mockAppointments);

            const response = await request(app).get('/appointments');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAppointments);
            expect(Appointment.getAppointments).toHaveBeenCalledTimes(1);
        });

        test('should return filtered appointments', async () => {
            const mockAppointments = [
                {
                    id: '1',
                    doctor: { user: { id: '10' } },
                    patient: { user: { id: '20' } },
                    time: '18.08.2024 13:15:00',
                    duration: '01:35:00',
                }
            ];
            Appointment.getAppointments.mockResolvedValue(mockAppointments);

            const response = await request(app).get('/appointments?doctorId=10');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAppointments);
            expect(Appointment.getAppointments).toHaveBeenCalledTimes(1);
            expect(Appointment.getAppointments).toHaveBeenCalledWith({
                doctorId: '10', patientId: undefined, nestDoctor: false,
                nestPatient: false, startBefore: undefined, startAfter: undefined,
                endBefore: undefined, endAfter: undefined
            });
        });

        test('should handle errors in getting appointments', async () => {
            Appointment.getAppointments.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/appointments');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });


    describe('GET /appointments/:id', () => {
        test('should return an appointment by ID', async () => {
            const mockAppointment = {
                id: '1',
                doctor: { user: { id: '10' } },
                patient: { user: { id: '20' } },
                time: '18.08.2024 13:15:00',
                duration: '01:35:00',
            };
            Appointment.getAppointmentsByIds.mockResolvedValue([mockAppointment]);

            const response = await request(app).get('/appointments/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAppointment);
            expect(Appointment.getAppointmentsByIds).toHaveBeenCalledWith([1], false, false);
        });

        test('should return 404 if appointment not found', async () => {
            Appointment.getAppointmentsByIds.mockResolvedValue([]);

            const response = await request(app).get('/appointments/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Appointment not found' });
        });

        test('should handle errors in getting appointment by ID', async () => {
            Appointment.getAppointmentsByIds.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/appointments/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /appointments', () => {
        test('should create a new appointment', async () => {
            const mockAppointmentData = {
                doctorId: '10',
                patientId: '20',
                time: '18.08.2024 13:15:00',
                duration: '01:35:00',
            };
            Patient.getPatientsByIds.mockResolvedValue([{ user: { id: '10' } }]);
            Doctor.getDoctorsByIds.mockResolvedValue([{ user: { id: '20' } }]);
            Appointment.prototype.insertAppointment.mockResolvedValue({ id: 'mocked-appointment-id' });
            Appointment.getAppointmentsByIds.mockResolvedValue([]);
            User.getUserById.mockResolvedValue({ id: '10' });
            User.getUserById.mockResolvedValue({ id: '20' });

            const response = await request(app).post('/appointments').send(mockAppointmentData);
            expect(response.status).toBe(201);
            expect(Appointment.prototype.insertAppointment).toHaveBeenCalledTimes(1);
        });

        test('should handle errors in creating an appointment', async () => {
            const mockAppointmentData = {
                doctorId: '10',
                patientId: '20',
                time: '18.08.2024 13:15:00',
                duration: '01:35:00',
            };

            Patient.getPatientsByIds.mockResolvedValue([{ user: { id: '10' } }]);
            Doctor.getDoctorsByIds.mockResolvedValue([{ user: { id: '20' } }]);
            Appointment.prototype.insertAppointment.mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/appointments').send(mockAppointmentData);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('PUT /appointments/:id', () => {
        test('should update an appointment by ID', async () => {
            const mockUpdatedAppointment = {
                id: '1',
                doctor: { user: { id: '10' } },
                patient: { user: { id: '20' } },
                time: '18.08.2024 13:15:00',
                duration: '01:35:00',
            };
    
            Appointment.updateAppointment.mockResolvedValue(mockUpdatedAppointment);
    
            const response = await request(app).put('/appointments/1').send(mockUpdatedAppointment);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedAppointment);
            expect(Appointment.updateAppointment).toHaveBeenCalledTimes(1);
        });
    
        test('should handle errors in updating an appointment', async () => {
            Appointment.updateAppointment.mockRejectedValue(new Error('Database error'));
    
            const response = await request(app).put('/appointments/1').send({ time: '18.08.2024 13:15:00' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });
    


    describe('DELETE /appointments/:id', () => {
        test('should delete an appointment by ID', async () => {
            Appointment.getAppointmentsByIds.mockResolvedValue([
                new Appointment({ user: { id: '20' } }, { user: { id: '10' } },
                    '18.08.2024 13:15:00', '01:35:00', '')]);
            Appointment.prototype.deleteAppointment.mockResolvedValue();

            const response = await request(app).delete('/appointments/1');
            expect(response.status).toBe(204);
            expect(Appointment.getAppointmentsByIds).toHaveBeenCalledWith([1]);
            expect(Appointment.prototype.deleteAppointment).toHaveBeenCalledTimes(1);
        });

        test('should return 404 if the appointment is not found', async () => {
            Appointment.getAppointmentsByIds.mockResolvedValue([]);

            const response = await request(app).delete('/appointments/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Appointment not found' });
        });

        test('should handle errors in deleting an appointment', async () => {
            Appointment.getAppointmentsByIds.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/appointments/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });


});