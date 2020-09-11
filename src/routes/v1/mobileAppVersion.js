const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileAppVersion')
const { routes } = require('../../constant')

router.get( routes.app.version, controller.getVersion);

module.exports = router;