const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.get('/all', appointmentController.getAllAppointments);

router.get('/:id', appointmentController.getAppointment);

router.post('/', appointmentController.createAppointment);

router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
