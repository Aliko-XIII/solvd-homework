const { Patient } = require('../../models/Patient');
const { User } = require('../../models/User');

const userFields = {
    firstName: 'John',
    lastName: 'Black',
    phone: '9999999999',
    password: 'pass1234324',
    age: 25,
    sex: 'M',
    id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12'
};

const patientFields = {
    insuranceNumber: 'INS-123456',
    insuranceProvider: 'HealthCare Inc.',
};

let patientId = null;

describe('Patient constructor', () => {
    const user = new User(userFields.firstName, userFields.lastName, userFields.phone,
        userFields.password, userFields.age, userFields.sex, userFields.id);
    const patient = new Patient(user, patientFields.insuranceNumber, patientFields.insuranceProvider);

    test('should return instance of Patient', () => {
        expect(patient).toBeInstanceOf(Patient);
    });

    test('should return object with corresponding fields', () => {
        expect(patient.insuranceNumber).toEqual(patientFields.insuranceNumber);
        expect(patient.insuranceProvider).toEqual(patientFields.insuranceProvider);
        expect(patient.user).toEqual(user);
    });

    test('should throw an error for invalid insuranceNumber', () => {
        expect(() => {
            const invalidPatient = new Patient(user, 12345, patientFields.insuranceProvider);
        }).toThrow(Error);
    });

    test('should throw an error for invalid insuranceProvider', () => {
        expect(() => {
            const invalidPatient = new Patient(user, patientFields.insuranceNumber, 12345);
        }).toThrow(Error);
    });
});

describe('Get patients array from DB records', () => {
    test('should return array of Patient objects', async () => {
        const patients = await Patient.getPatientsFromData([
            {
                insurance_number: 'INS-123456',
                insurance_provider: 'HealthCare Inc.',
                user_id: userFields.id,
                first_name: userFields.firstName,
                last_name: userFields.lastName,
                phone: userFields.phone,
                pass: userFields.password,
                age: userFields.age,
                sex: userFields.sex
            },
            {
                insurance_number: 'INS-654321',
                insurance_provider: 'MediCare Corp.',
                user_id: 'another-user-id',
                first_name: 'Jane',
                last_name: 'Doe',
                phone: '0987654321',
                pass: 'securepass',
                age: 28,
                sex: 'F'
            }
        ]);
        expect(patients).toBeInstanceOf(Array);
        patients.forEach(patient => {
            expect(patient).toBeInstanceOf(Patient);
        });
    });
});

describe('Get all patients from DB', () => {
    test('should return array of Patient objects', async () => {
        const patients = await Patient.getPatients();
        expect(patients).toBeInstanceOf(Array);
        patients.forEach(patient => {
            expect(patient).toBeInstanceOf(Patient);
        });
    });

    test('should return array with insuranceNumber filter applied', async () => {
        const patients = await Patient.getPatients({ insuranceNumber: '1' });
        expect(patients).toBeInstanceOf(Array);
        patients.forEach(patient => {
            expect(patient).toBeInstanceOf(Patient);
            expect(patient.insuranceNumber.indexOf('1') !== -1).toBeTruthy();
        });
    });

    test('should return array with insuranceProvider filter applied', async () => {
        const patients = await Patient.getPatients({ insuranceProvider: 'Care' });
        expect(patients).toBeInstanceOf(Array);
        patients.forEach(patient => {
            expect(patient).toBeInstanceOf(Patient);
            expect(patient.insuranceProvider.indexOf('Care') !== -1).toBeTruthy();
        });
    });
});

describe('Insert a patient to DB', () => {
    test('should return an object with patient\'s id', async () => {
        const user = new User(userFields.firstName, userFields.lastName, userFields.phone,
            userFields.password, userFields.age, userFields.sex);
        await user.insertUser();
        const patient = new Patient(user, patientFields.insuranceNumber, patientFields.insuranceProvider);
        const id = (await patient.insertPatient()).id;
        patientId = id;
        expect(id.length > 0).toBeTruthy();
    });
});

describe('Get patient by id from DB', () => {
    test('should return a Patient object', async () => {
        const patient = await Patient.getPatientById(patientId);
        expect(patient).toBeInstanceOf(Patient);
        expect(patient.user.id).toEqual(patientId);
    });
});

describe('Update patient by id in DB', () => {
    test('should return a patient with updated insuranceProvider', async () => {
        const updated = await Patient.updatePatient(patientId, { insuranceProvider: 'NewHealth Inc.' });
        expect(updated.insuranceProvider).toEqual('NewHealth Inc.');
        const patient = await Patient.getPatientById(patientId);
        expect(patient.insuranceProvider).toEqual('NewHealth Inc.');
    });

    test('should return a patient with updated insuranceNumber', async () => {
        const updated = await Patient.updatePatient(patientId, { insuranceNumber: 'INS-987654' });
        expect(updated.insuranceNumber).toEqual('INS-987654');
        const patient = await Patient.getPatientById(patientId);
        expect(patient.insuranceNumber).toEqual('INS-987654');
    });
});

describe('Remove patient from DB', () => {
    test('should remove patient from DB', async () => {
        const patient = await Patient.getPatientById(patientId);
        expect(async () => { await patient.deletePatient() }).not.toThrow();
        const user = await User.getUserById(patientId);
        await user.deleteUser()
    });
});
