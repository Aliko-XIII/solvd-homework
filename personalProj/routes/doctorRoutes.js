const express = require('express');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.get('/all', doctorController.getAllDoctors);

router.get('/:id', doctorController.getDoctor);

router.get('/:id/appointments', doctorController.getAppointments);

router.post('/', doctorController.createDoctor);

router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;

