const express = require('express');
const symptomController = require('../controllers/symptomController');

const router = express.Router();

router.get('/all', symptomController.getAllSymptoms);

router.get('/:id', symptomController.getSymptom);

router.post('/', symptomController.createSymptom);

router.delete('/:id', symptomController.deleteSymptom);

module.exports = router;
