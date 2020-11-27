const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/authentication')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

const AUTH_BASE_URL = '/auth'

router.post(AUTH_BASE_URL + routes.authentication.login, controller.login);
router.post(AUTH_BASE_URL + routes.authentication.loginCompany, auth.authenticateToken, controller.loginCompany);
router.post(AUTH_BASE_URL + routes.authentication.loginAuto, controller.autoLogin);

module.exports = router;