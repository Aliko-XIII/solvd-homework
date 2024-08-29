const { Doctor } = require('../../models/Doctor');
const { User } = require('../../models/User');
const { Specialization } = require('../../models/Specialization');
const { query } = require('../../config/database');

// Mock the query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

describe('Doctor Class', () => {
    describe('Doctor constructor', () => {
        const mockUser = new User('John', 'Doe', '123456789', 'password', 35, 'M');
        const mockSpecialization = new Specialization('Cardiology', 'Heart-related treatment', [], []);

        test('should create a valid Doctor instance', () => {
            const doctor = new Doctor(mockUser, mockSpecialization, 10, new Date('2024-08-28T08:00:00'), new Date('2024-08-28T17:00:00'));
            expect(doctor.user).toBe(mockUser);
            expect(doctor.specialization).toBe(mockSpecialization);
            expect(doctor.patientLoad).toBe(10);
            expect(doctor.workdayStart).toEqual(new Date('2024-08-28T08:00:00'));
            expect(doctor.workdayEnd).toEqual(new Date('2024-08-28T17:00:00'));
        });

        test('should throw an error for invalid patientLoad', () => {
            expect(() => new Doctor(mockUser, mockSpecialization, -1)).toThrow('Patient load is not valid.');
        });
    });

    describe('Insert a doctor to DB', () => {
        const mockUser = new User('John', 'Doe', '123456789', 'password', 35, 'M');
        const mockSpecialization = new Specialization('Cardiology', 'Heart-related treatment', [], []);
        
        test('should insert a new doctor', async () => {
            query.mockResolvedValue({
                rows: [{ user_id: '3' }],
            });

            const doctor = new Doctor(mockUser, mockSpecialization, 10, new Date('2024-08-28T08:00:00'), new Date('2024-08-28T17:00:00'));
            const { id } = await doctor.insertDoctor();

            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO doctors'));
            expect(id).toBe('3');
            expect(doctor.id).toBe('3');
        });
    });

    describe('Get doctors from DB', () => {
        test('should return an array of Doctor instances', async () => {
            query.mockResolvedValue({
                rows: [
                    { user_id: '1', specialization_id: '101', patient_load: 10, workday_start: '08:00:00', workday_end: '17:00:00' },
                    { user_id: '2', specialization_id: '102', patient_load: 15, workday_start: '09:00:00', workday_end: '18:00:00' }
                ]
            });

            const doctors = await Doctor.getDoctors();
            expect(doctors).toHaveLength(2);
            doctors.forEach(doctor => {
                expect(doctor).toBeInstanceOf(Doctor);
            });
        });

        test('should call query with proper specialization filter', async () => {
            query.mockResolvedValue({ rows: [] });
            await Doctor.getDoctors({ specializationId: 101 });

            expect(query).toHaveBeenCalledWith(expect.stringContaining('WHERE specialization_id=101'));
        });
    });

    describe('Update doctor by ID in DB', () => {
        test('should throw an error if no updates are provided', async () => {
            await expect(Doctor.updateDoctor('1', {})).rejects.toThrow('No parameters to update.');
        });

        test('should update doctor information', async () => {
            query.mockResolvedValue({
                rows: [
                    { user_id: '1', specialization_id: '102', patient_load: 20, workday_start: '09:00:00', workday_end: '18:00:00' }
                ]
            });

            const updatedDoctor = await Doctor.updateDoctor('1', { patientLoad: 20 });
            expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE doctors SET'));
            expect(updatedDoctor.patientLoad).toBe(20);
        });
    });

    describe('Delete doctor from DB', () => {
        const mockUser = new User('John', 'Doe', '123456789', 'password', 35, 'M', '1');
        const mockSpecialization = new Specialization('Cardiology', 'Heart-related treatment', [], []);

        test('should delete a doctor', async () => {
            query.mockResolvedValue({
                rows: [{ user_id: '1' }],
            });

            const doctor = new Doctor(mockUser, mockSpecialization);
            await doctor.deleteDoctor();

            expect(query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM doctors WHERE user_id = '1'"));
        });
    });
});
