const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getAllUsersProfiles);

router.get('/:id', userController.getUserProfile);

router.post('/register', userController.createUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;

