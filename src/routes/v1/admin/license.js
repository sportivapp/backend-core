const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/license')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post( routes.license.id, auth.authenticateToken, controller.getLicenseById);

module.exports = router;