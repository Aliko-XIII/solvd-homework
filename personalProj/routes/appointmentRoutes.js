const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', appointmentController.getAllAppointments);

router.get('/:id', appointmentController.getAppointment);

router.put(':/id');

router.post('/', appointmentController.createAppointment);

router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
