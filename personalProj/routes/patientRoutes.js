const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.get('/', patientController.getAllPatients);

router.get('/:id', patientController.getPatient);

router.get('/:id/appointments', patientController.getAppointments);

router.post('/', patientController.createPatient);

router.delete('/:id', patientController.deletePatient);

module.exports = router;

