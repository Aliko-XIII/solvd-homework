const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUser);

router.post('/register', userController.createUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;

