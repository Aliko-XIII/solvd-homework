const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.get('/all', patientController.getAllPatients);

router.get('/:id', patientController.getPatient);

router.post('/', patientController.createPatient);

router.delete('/:id', patientController.deletePatient);

module.exports = router;

