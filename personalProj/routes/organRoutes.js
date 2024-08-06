const express = require('express');
const organController = require('../controllers/organController');

const router = express.Router();

router.get('/', organController.getAllOrgans);

router.get('/:id', organController.getOrgan);

router.post('/', organController.createOrgan);

router.put('/:id', organController.updateOrgan);

router.delete('/:id', organController.deleteOrgan);

module.exports = router;
