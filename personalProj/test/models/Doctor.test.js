const { Doctor } = require('../../models/Doctor');
const { Specialization } = require('../../models/Specialization');
const { User } = require('../../models/User');

const userFields = {
    firstName: 'John',
    lastName: 'Black',
    phone: '1324234532',
    password: 'pass1234324',
    age: 25,
    sex: 'M',
    id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12'
};

const doctorFields = {
    specialization: { id: 1 },
    patientLoad: 3,
    workdayStart: '08:59:00',
    workdayEnd: '16:56:00',
};

let doctorId = null;

describe('Doctor constructor', () => {
    const user = new User(userFields.firstName, userFields.lastName, userFields.phone,
        userFields.password, userFields.age, userFields.sex, userFields.id);
    const doctor = new Doctor(user, doctorFields.specialization, doctorFields.patientLoad,
        doctorFields.workdayStart, doctorFields.workdayEnd);

    test('should return instance of Doctor', () => {
        expect(doctor).toBeInstanceOf(Doctor);
    });

    test('should return object with corresponding fields', () => {
        expect(doctor.specialization).toEqual(doctorFields.specialization);
        expect(doctor.patientLoad).toEqual(doctorFields.patientLoad);
        expect(doctor.workdayStart).toEqual(doctorFields.workdayStart);
        expect(doctor.workdayEnd).toEqual(doctorFields.workdayEnd);
        expect(doctor.user).toEqual(user);
    });

    test('should throw an error for invalid patientLoad', () => {
        expect(() => {
            const invalidDoctor = new Doctor(user, doctorFields.specialization, -1, doctorFields.workdayStart, doctorFields.workdayEnd);
        }).toThrow(Error);
    });

    // test('should throw an error for invalid workday', () => {
    //     expect(() => {
    //         const invalidDoctor = new Doctor(user, doctorFields.specialization, doctorFields.patientLoad, 'invalid-time', doctorFields.workdayEnd);
    //     }).toThrow(Error);
    // });

});

describe('Get doctors array from DB records', () => {
    test('should return array of Doctor objects', async () => {
        const doctors = await Doctor.getDoctorsFromData([
            {
                specialization_id: 1,
                patient_load: doctorFields.patientLoad,
                workday_start: doctorFields.workdayStart,
                workday_end: doctorFields.workdayEnd,
                user_id: userFields.id,
                first_name: userFields.firstName,
                last_name: userFields.lastName,
                phone: userFields.phone,
                pass: userFields.password,
                age: userFields.age,
                sex: userFields.sex
            },
            {
                specialization_id: 2,
                patient_load: doctorFields.patientLoad,
                workday_start: doctorFields.workdayStart,
                workday_end: doctorFields.workdayEnd,
                user_id: userFields.id,
                first_name: userFields.firstName,
                last_name: userFields.lastName,
                phone: userFields.phone,
                pass: userFields.password,
                age: userFields.age,
                sex: userFields.sex
            },
        ]);
        expect(doctors).toBeInstanceOf(Array);
        doctors.forEach(doctor => {
            expect(doctor).toBeInstanceOf(Doctor);
        });
    });
});

describe('Get all doctors from DB', () => {
    test('should return array of Doctor objects', async () => {
        const doctors = await Doctor.getDoctors();
        expect(doctors).toBeInstanceOf(Array);
        doctors.forEach(doctor => {
            expect(doctor).toBeInstanceOf(Doctor);
        });
    });

    test('should return array with nested user objects', async () => {
        const doctors = await Doctor.getDoctors({ nestUser: true });
        expect(doctors).toBeInstanceOf(Array);
        doctors.forEach(doctor => {
            expect(doctor).toBeInstanceOf(Doctor);
            expect(Object.keys(doctor.user).length > 1).toBeTruthy();
        });
    });

    test('should return array with nested specialization objects', async () => {
        const doctors = await Doctor.getDoctors({ nestSpecialization: true });
        expect(doctors).toBeInstanceOf(Array);
        doctors.forEach(doctor => {
            expect(doctor).toBeInstanceOf(Doctor);
            expect(Object.keys(doctor.specialization).length > 1).toBeTruthy();
        });
    });
});

describe('Insert a doctor to DB', () => {
    test('should return an object with doctor\'s id', async () => {
        const user = new User(userFields.firstName, userFields.lastName, userFields.phone,
            userFields.password, userFields.age, userFields.sex);
        await user.insertUser();
        const doctor = new Doctor(user, doctorFields.specialization, doctorFields.patientLoad,
            doctorFields.workdayStart, doctorFields.workdayEnd)
        const id = (await doctor.insertDoctor()).id;
        doctorId = id;
        expect(id.length > 0).toBeTruthy();
    });
});

describe('Get doctor by id from DB', () => {
    test('should return a Doctor object', async () => {
        const doctor = (await Doctor.getDoctorsByIds([doctorId]))[0];
        expect(doctor).toBeInstanceOf(Doctor);
        expect(doctor.user.id).toEqual(doctorId);
    });
});

describe('Update doctor by id in DB', () => {
    test('should return a doctor with updated patient load', async () => {
        const updated = await Doctor.updateDoctor(doctorId, { patientLoad: 5 });
        expect(updated.patientLoad).toEqual(5);
        const doctor = (await Doctor.getDoctorsByIds([doctorId]))[0];
        expect(doctor.patientLoad).toEqual(5);
    });

    test('should return a doctor with updated workday', async () => {
        const updated = await Doctor.updateDoctor(doctorId, {
            workdayStart: '07:59:00', workdayEnd: '19:59:00'
        });
        expect(updated.workdayStart).toEqual('07:59:00');
        expect(updated.workdayEnd).toEqual('19:59:00');
        const doctor = (await Doctor.getDoctorsByIds([doctorId]))[0];
        expect(doctor.workdayStart).toEqual('07:59:00');
        expect(doctor.workdayEnd).toEqual('19:59:00');
    });
});

describe('Remove doctor from DB', () => {
    test('should remove dctor from DB', async () => {
        const doctor = (await Doctor.getDoctorsByIds([doctorId]))[0];
        expect(async () => { await doctor.deleteDoctor() }).not.toThrow();
        const user = await User.getUserById(doctorId);
        await user.deleteUser()
    });
});
