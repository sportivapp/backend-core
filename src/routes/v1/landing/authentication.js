const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/authentication')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post('/auth' + routes.authentication.login, controller.login);
router.post('/auth' + routes.authentication.loginCompany, auth.authenticateToken, controller.loginCompany);
router.post('/auth' + routes.authentication.loginAuto, controller.autoLogin);

module.exports = router;