const { Appointment } = require('../../models/Appointment');
const { Doctor } = require('../../models/Doctor');
const { Patient } = require('../../models/Patient');
const { User } = require('../../models/User');

const userFields = {
    firstName: 'John',
    lastName: 'Black',
    phone: '1324234532',
    password: 'pass1234324',
    age: 25,
    sex: 'M',
    id1: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12',
    id2: 'gkodfmg-543jdfnkz-32jfdsnkvk-12czx',
};

const doctorFields = {
    specialization: { id: 1 },
    patientLoad: 3,
    workdayStart: '08:59:00',
    workdayEnd: '16:56:00',
};

const patientFields = {
    insuranceNumber: 'INS-123456',
    insuranceProvider: 'HealthCare Inc.',
};

const appointmentFields = {
    time: '2024-07-18 09:00:00',
    duration: '00:30:00',
    description: 'text description for appointment',
    id: 1
}

let appointmentId = null;
let user1Id = null;
let user2Id = null;

describe('Appointment constructor', () => {
    const user1 = new User(userFields.firstName, userFields.lastName, userFields.phone,
        userFields.password, userFields.age, userFields.sex, userFields.id1);
    const doctor = new Doctor(user1, doctorFields.specialization, doctorFields.patientLoad,
        doctorFields.workdayStart, doctorFields.workdayEnd);

    const user2 = new User(userFields.firstName, userFields.lastName, userFields.phone,
        userFields.password, userFields.age, userFields.sex, userFields.id1);
    const patient = new Patient(patientFields.insuranceNumber,
        patientFields.insuranceProvider, user2);

    const appointment = new Appointment(patient, doctor, appointmentFields.time,
        appointmentFields.duration, appointmentFields.description, appointmentFields.id);

    test('should return instance of Appointment', () => {
        expect(appointment).toBeInstanceOf(Appointment);
    });

    test('should return object with corresponding fields', () => {
        expect(appointment.patient).toEqual(patient);
        expect(appointment.doctor).toEqual(doctor);
        expect(appointment.time).toEqual(appointmentFields.time);
        expect(appointment.duration).toEqual(appointmentFields.duration);
        expect(appointment.description).toEqual(appointmentFields.description);
        expect(appointment.id).toEqual(appointmentFields.id);
    });

    test('should throw an error for invalid description', () => {
        expect(() => {
            const invalidAppointment = new Appointment(patient, doctor, appointmentFields.time,
                appointmentFields.duration, 123, appointmentFields.id);
        }).toThrow(Error);
    });

});

describe('Get appointments array from DB records', () => {
    const user1 = new User(userFields.firstName, userFields.lastName, userFields.phone,
        userFields.password, userFields.age, userFields.sex, userFields.id1);
    const doctor = new Doctor(user1, doctorFields.specialization, doctorFields.patientLoad,
        doctorFields.workdayStart, doctorFields.workdayEnd);

    const user2 = new User(userFields.firstName, userFields.lastName, userFields.phone,
        userFields.password, userFields.age, userFields.sex, userFields.id1);
    const patient = new Patient(patientFields.insuranceNumber,
        patientFields.insuranceProvider, user2);

    test('should return array of appointment objects', async () => {
        const appointments = await Appointment.getAppointmentsFromData([
            {
                patient_id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12',
                doctor_id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12',
                appointment_time: '08:59:00',
                appointment_duration: '00:30:00',
                additional_info: 'text description',
                appointment_id: 1
            },
            {
                patient_id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12',
                doctor_id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12',
                appointment_time: '18:59:00',
                appointment_duration: '00:45:00',
                additional_info: 'text description',
                appointment_id: 2
            },
            {
                patient_id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12',
                doctor_id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12',
                appointment_time: '09:59:00',
                appointment_duration: '00:50:00',
                additional_info: 'text description',
                appointment_id: 3
            }]);
        expect(appointments).toBeInstanceOf(Array);
        appointments.forEach(appointment => {
            expect(appointment).toBeInstanceOf(Appointment)
        });


    });
});

describe('Get all appointments from DB', () => {
    test('should return array of Appointment objects', async () => {
        const appointments = await Appointment.getAppointments();
        expect(appointments).toBeInstanceOf(Array);
        appointments.forEach(appointment => {
            expect(appointment).toBeInstanceOf(Appointment);
        });
    });

    test('should return array with nested doctor objects', async () => {
        const appointments = await Appointment.getAppointments({ nestDoctor: true });
        expect(appointments).toBeInstanceOf(Array);
        appointments.forEach(appointment => {
            expect(appointment).toBeInstanceOf(Appointment);
            expect(appointment.doctor == null ||
                Object.keys(appointment.doctor).length > 1).toBeTruthy();
        });

    });

    test('should return array with nested patient objects', async () => {
        const appointments = await Appointment.getAppointments({ nestPatient: true });
        expect(appointments).toBeInstanceOf(Array);
        appointments.forEach(appointment => {
            expect(appointment).toBeInstanceOf(Appointment);
            expect(appointment.patient == null ||
                Object.keys(appointment.patient).length > 1).toBeTruthy();
        });

    });

});

describe('Insert an appointment to DB', () => {
    test('should return an object with appointment\'s id', async () => {
        const user1 = new User(userFields.firstName, userFields.lastName, '66666666666',
            userFields.password, userFields.age, userFields.sex);
        await user1.insertUser();
        const doctor = new Doctor(user1, doctorFields.specialization, doctorFields.patientLoad,
            doctorFields.workdayStart, doctorFields.workdayEnd);
        user1Id = (await doctor.insertDoctor()).id;

        const user2 = new User(userFields.firstName, userFields.lastName, '555555555555',
            userFields.password, userFields.age, userFields.sex);
        await user2.insertUser();
        const patient = new Patient(patientFields.insuranceNumber, patientFields.insuranceProvider, user2);
        user2Id = (await patient.insertPatient()).id;

        const appointment = new Appointment(patient, doctor, appointmentFields.time,
            appointmentFields.duration, appointmentFields.description);
        const id = (await appointment.insertAppointment()).id;
        appointmentId = id;

        expect(id).toBeTruthy();
    });
});

describe('Get appointment by id from DB', () => {
    test('should return an appointment object', async () => {
        const appointment = (await Appointment.getAppointmentsByIds([appointmentId]))[0];
        expect(appointment).toBeInstanceOf(Appointment);
        expect(appointment.id).toEqual(appointmentId);
    });
});

describe('Update appointment by id in DB', () => {
    test('should return an appointment with updated time', async () => {
        const updated = await Appointment.updateAppointment(appointmentId,
            { time: '2024-07-18 13:33:00' });
        expect(Date(updated.time)).toEqual(Date('2024-07-18 13:33:00'));
        const appointment = (await Appointment.getAppointmentsByIds([appointmentId]))[0];
        expect(Date(appointment.time)).toEqual(Date('2024-07-18 13:33:00'));
    });

    test('should return an appointment with updated description', async () => {
        const updated = await Appointment.updateAppointment(appointmentId,
            { description: 'new description text' });
        expect(updated.description).toEqual('new description text');
        const appointment = (await Appointment.getAppointmentsByIds([appointmentId]))[0];
        expect(appointment.description).toEqual('new description text');
    });

});

describe('Remove appointment from DB', () => {
    test('should remove appointment from DB', async () => {
        const appointment = (await Appointment.getAppointmentsByIds([appointmentId]))[0];
        expect(async () => { await appointment.deleteAppointment() }).not.toThrow();

        const doctor = (await Doctor.getDoctorsByIds([user1Id]))[0];
        await doctor.deleteDoctor();
        const user1 = await User.getUserById(user1Id);
        await user1.deleteUser();

        const patient = await Patient.getPatientById(user2Id);
        await patient.deletePatient();
        const user2 = await User.getUserById(user2Id);
        await user2.deleteUser();
    });
});
