const express = require('express');
const authorizationController = require('../controllers/authorizationController');
const userController = require('../controllers/userController');


const router = express.Router();


router.post('/login', authorizationController.loginUser);

router.post('/register', userController.createUser);

router.post('/refresh', authorizationController.refreshAccessToken);

module.exports = router;

