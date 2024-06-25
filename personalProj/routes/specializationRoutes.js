const express = require('express');
const specializationController = require('../controllers/specializationController');

const router = express.Router();

router.get('/all', specializationController.getAllSpecializations);

router.get('/:id', specializationController.getSpecialization);

router.post('/', specializationController.createSpecialization);

router.delete('/:id', specializationController.deleteSpecialization);

module.exports = router;
