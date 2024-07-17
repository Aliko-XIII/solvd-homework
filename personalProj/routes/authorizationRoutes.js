const express = require('express');
const authorizationController = require('../controllers/authorizationController');


const router = express.Router();


router.post('/login', authorizationController.loginUser);

router.post('/refresh', authorizationController.refreshAccessToken);

module.exports = router;
