const { User } = require('../models/User');
const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');

async function loadData() {
    const patientArr = await Patient.getPatients();

    const doctorArr = await Doctor.getDoctors();

    return {
        patients: patientArr,
        doctors: doctorArr,
    }
}

loadData().then(res => { console.log(res.doctors[0].availableFrom.constructor.name) });