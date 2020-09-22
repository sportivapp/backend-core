const express = require('express');
const router = express.Router();
const controller = require('../../controllers/license')
const auth = require('../../middlewares/authentication');

router.get('/license/:licenseId', auth.authenticateToken, controller.getLicense);

module.exports = router;