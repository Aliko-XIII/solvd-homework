const { Appointment } = require('../../models/Appointment');
const { Patient } = require('../../models/Patient');
const { Doctor } = require('../../models/Doctor');
const { query } = require('../../config/database');

jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));
jest.mock('../../models/Doctor');
jest.mock('../../models/Patient');

describe('Appointment Class', () => {

    // Constructor Tests
    describe('Constructor', () => {
        test('should create a valid Appointment instance', () => {
            const patient = new Patient({ id: 'patient-uuid' }, '12345', 'Provider A');
            const doctor = new Doctor({ id: 'doctor-uuid' }, 'Cardiology', 10, '09:00', '17:00');
            const appointment = new Appointment(patient, doctor, '18.08.2024 13:15:00', '01:35:00', 'General checkup');

            expect(appointment).toBeInstanceOf(Appointment);
            expect(appointment.description).toBe('General checkup');
            expect(appointment.patient).toBe(patient);
            expect(appointment.doctor).toBe(doctor);
        });

        test('should throw an error for invalid description', () => {
            const patient = new Patient({ id: 'patient-uuid' }, '12345', 'Provider A');
            const doctor = new Doctor({ id: 'doctor-uuid' }, 'Cardiology', 10, '09:00', '17:00');

            expect(() => new Appointment(patient, doctor, '18.08.2024 13:15:00', '01:35:00', 12345))
                .toThrow('Description is not valid');
        });
    });

    describe('Insert an appointment to DB', () => {
        beforeEach(() => {
            query.mockReset();
        });

        test('should insert a new appointment and return the inserted ID', async () => {
            const patient = { user: { id: 'patient-uuid' } };
            const doctor = { user: { id: 'doctor-uuid' }, patientLoad: 10 };
            const appointment = new Appointment(patient, doctor, '18.08.2024 13:15:00', '01:35:00', 'General checkup');

            // Mocking the queries for isAvailable method
            query.mockResolvedValueOnce({ rows: [] }); // Mock getDoctorAppointments for date
            query.mockResolvedValueOnce({ rows: [] }); // Mock getDoctorAppointments for date, time, duration
            query.mockResolvedValueOnce({ rows: [] }); // Mock getPatientAppointments for date, time, duration

            // Mock getPatientAppointments for date, time, duration
            query.mockResolvedValueOnce({
                rows: [{
                    appointment_id: 1, patient_id: 'patient-uuid',
                    doctor_id: 'doctor-uuid', appointment_time: '18.08.2024 13:15:00',
                    appointment_duration: '01:35:00', additional_info: 'General checkup'
                }]
            });

            const result = await appointment.insertAppointment();
            expect(result.id).toBe(1);
        });
    });

    describe('Get appointment by id from DB', () => {
        beforeEach(() => {
            query.mockReset();
        });

        test('should return an appointment by ID', async () => {
            query.mockResolvedValueOnce({
                rows: [
                    {
                        appointment_id: 1,
                        patient_id: 'patient-uuid',
                        doctor_id: 'doctor-uuid',
                        appointment_time: '18.08.2024 13:15:00',
                        appointment_duration: '01:35:00',
                        additional_info: 'General checkup'
                    }
                ]
            });

            const appointments = await Appointment.getAppointmentsByIds([1]);

            expect(appointments).toHaveLength(1);
            expect(appointments[0]).toBeInstanceOf(Appointment);

            expect(appointments[0].id).toBe(1);
            expect(appointments[0].time).toBe('18.08.2024 13:15:00');
            expect(appointments[0].duration).toBe('01:35:00');
            expect(appointments[0].description).toBe('General checkup');
            expect(appointments[0].patient.user.id).toBe('patient-uuid');
            expect(appointments[0].doctor.user.id).toBe('doctor-uuid');
        });
    });

    describe('Get all appointments from DB', () => {
        beforeEach(() => {
            query.mockReset();
        });
        test('should fetch appointments with the correct filters', async () => {
            query.mockResolvedValueOnce({ rows: [{ appointment_id: 1, patient_id: 'patient-uuid', doctor_id: 'doctor-uuid', appointment_time: '18.08.2024 13:15:00', appointment_duration: '01:35:00', additional_info: 'General checkup' }] });

            const result = await Appointment.getAppointments({ patientId: 'patient-uuid', doctorId: 'doctor-uuid' });

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Appointment);
            expect(query).toHaveBeenCalledWith(expect.stringContaining('WHERE patient_id = \'patient-uuid\' AND doctor_id = \'doctor-uuid\''));
        });
    });

    describe('Update appointment by id in DB', () => {
        beforeEach(() => {
            query.mockReset();
        });
        test('should update an appointment and return the updated record', async () => {
            const updates = { time: '18.08.2024 13:15:00', duration: '02:00:00', description: 'Updated checkup' };
            query.mockResolvedValueOnce({
                rows: [{
                    appointment_id: 1, appointment_time: updates.time,
                    appointment_duration: '02:00:00', additional_info: 'Old checkup',
                    patient_id: 'update-patient', doctor_id: 'update-doctor'
                }]
            });
            Patient.getPatientsByIds.mockResolvedValueOnce([{
                user: { id: 'update-patient' },
            }]);
            Doctor.getDoctorsByIds.mockResolvedValueOnce([{
                user: { id: 'update-doctor' },
                patientLoad: 4
            }]);
            // Mocking the queries for isAvailable method
            query.mockResolvedValueOnce({ rows: [] }); // Mock getDoctorAppointments for date
            query.mockResolvedValueOnce({ rows: [] }); // Mock getDoctorAppointments for date, time, duration
            query.mockResolvedValueOnce({ rows: [] }); // Mock getPatientAppointments for date, time, duration

            query.mockResolvedValueOnce({ rows: [{ appointment_id: 1, appointment_time: updates.time, appointment_duration: '02:00:00', additional_info: 'Updated checkup' }] });
            const updatedAppointment = await Appointment.updateAppointment(1, updates);

            expect(updatedAppointment.description).toBe('Updated checkup');
            expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE appointments'));
        });

        test('should throw an error if no parameters to update are provided', async () => {
            await expect(Appointment.updateAppointment(1, {})).rejects.toThrow('No parameters to update.');
        });
    });

    describe('Delete appointment from DB', () => {
        test('should delete an appointment and return the deleted record', async () => {
            query.mockResolvedValueOnce({ rows: [{ appointment_id: 1 }] });

            const appointment = new Appointment({ id: 'patient-uuid' }, { id: 'doctor-uuid' }, '18.08.2024 13:15:00', '01:35:00', 'General checkup', 1);
            await appointment.deleteAppointment();

            expect(query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM appointments WHERE appointment_id = 1'));
        });
    });
});
