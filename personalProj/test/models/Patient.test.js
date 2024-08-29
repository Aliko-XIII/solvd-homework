const { Patient } = require('../../models/Patient');
const { User } = require('../../models/User');
const { query } = require('../../config/database');

jest.mock('../../config/database');

describe('Patient Class', () => {
    describe('Patient constructor', () => {
        test('should create a valid Patient instance', () => {
            const user = new User('Jane', 'Smith', '5551234', 'password', 22, 'F');
            const patient = new Patient(user, 'INS123456', 'HealthCare Inc.');
            expect(patient.insuranceNumber).toBe('INS123456');
            expect(patient.insuranceProvider).toBe('HealthCare Inc.');
        });

        test('should throw error for invalid insurance number', () => {
            const user = new User('Jane', 'Smith', '5551234', 'password', 22, 'F');
            expect(() => new Patient(user, '', 'HealthCare Inc.')).toThrow(Error);
        });

        test('should throw error for invalid insurance provider', () => {
            const user = new User('Jane', 'Smith', '5551234', 'password', 22, 'F');
            expect(() => new Patient(user, 'INS123456', '')).toThrow(Error);
        });
    });

    describe('Get patients array from DB records', () => {
        test('should return an array of Patient objects', async () => {
            const patients = await Patient.getPatientsFromData([
                {
                    user_id: 'user1',
                    insurance_number: 'INS123',
                    insurance_provider: 'Provider A',
                    user_id: 'user1',
                    first_name: 'John',
                    last_name: 'Doe',
                    phone: '123-456-7890',
                    age: 30,
                    sex: 'M',
                    pass: 'password'

                },
                {
                    user_id: 'user2',
                    insurance_number: 'INS456',
                    insurance_provider: 'Provider B',
                    user_id: 'user2',
                    first_name: 'Jane',
                    last_name: 'Smith',
                    phone: '098-765-4321',
                    age: 25,
                    sex: 'F',
                    pass: 'securepass'
                }
            ], true);

            expect(patients).toBeInstanceOf(Array);
            patients.forEach(patient => {
                expect(patient).toBeInstanceOf(Patient);
            });
        });
    });

    describe('Insert a patient into DB', () => {
        test('should insert a new patient', async () => {
            query.mockResolvedValue({
                rows: [{ user_id: '3' }],
            });

            const user = new User('Jane', 'Smith', '5551234', 'password', 22, 'F');
            const patient = new Patient(user, 'INS789', 'Provider C');
            const { id } = await patient.insertPatient();

            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO patients'));
            expect(id).toBe('3');
            expect(patient.id).toBe('3');
        });
    });

    describe('Get patient by id from DB', () => {
        test('should return a patient by ID', async () => {
            query.mockResolvedValue({
                rows: [
                    {
                        user_id: '2',
                        insurance_number: 'INS456',
                        insurance_provider: 'Provider B',
                        first_name: 'Jane',
                        last_name: 'Smith',
                        phone: '098-765-4321',
                        age: 25,
                        sex: 'F',
                        pass: 'securepass'
                    }
                ],
            });

            const patient = await Patient.getPatientById('2', true);
            expect(patient).toBeInstanceOf(Patient);
            expect(patient.insuranceNumber).toBe('INS456');
        });
    });

    describe('Get all patients from DB', () => {
        test('should call query with proper filters', async () => {
            query.mockResolvedValue({ rows: [] });
            await Patient.getPatients({ insuranceNumber: 'INS123', insuranceProvider: 'Provider A' });

            expect(query).toHaveBeenCalledWith(expect.stringContaining("insurance_number LIKE '%INS123%'"));
            expect(query).toHaveBeenCalledWith(expect.stringContaining("insurance_provider LIKE '%Provider A%'"));
        });

        test('should return an array of Patient instances', async () => {
            query.mockResolvedValue({
                rows: [
                    {
                        user_id: '1',
                        insurance_number: 'INS123',
                        insurance_provider: 'Provider A',
                        first_name: 'John',
                        last_name: 'Doe',
                        phone: '123-456-7890',
                        age: 30,
                        sex: 'M',
                        pass: 'password'
                    }
                ],
            });

            const patients = await Patient.getPatients();
            expect(patients).toHaveLength(1);
            expect(patients[0]).toBeInstanceOf(Patient);
            expect(patients[0].insuranceNumber).toBe('INS123');
        });
    });

    describe('Update patient by id in DB', () => {
        test('should throw an error if no updates are provided', async () => {
            await expect(Patient.updatePatient('1', {})).rejects.toThrow('No parameters to update.');
        });

        test('should update patient information', async () => {
            query.mockResolvedValue({
                rows: [
                    {
                        user_id: '1',
                        insurance_number: 'INS789',
                        insurance_provider: 'Provider D',
                        first_name: 'John',
                        last_name: 'Doe',
                        phone: '123-456-7890',
                        age: 30,
                        sex: 'M',
                        pass: 'password'
                    }
                ],
            });

            const updatedPatient = await Patient.updatePatient('1', { insuranceNumber: 'INS789', insuranceProvider: 'Provider D' });
            expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE patients SET'));
            expect(updatedPatient.insuranceNumber).toBe('INS789');
            expect(updatedPatient.insuranceProvider).toBe('Provider D');
        });
    });

    describe('Delete patient from DB', () => {
        test('should delete a patient', async () => {
            query.mockResolvedValue({
                rows: [{ user_id: '1' }],
            });

            const user = new User('John', 'Doe', '123456789', 'password', 30, 'M', '1');
            const patient = new Patient(user, 'INS123', 'Provider A');
            await patient.deletePatient();

            expect(query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM patients WHERE user_id = '1'"));
        });
    });
});