const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/otp');

router.post('/otp-email', controller.createOtp);

module.exports = router;