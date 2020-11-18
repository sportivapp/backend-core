const express = require('express');
const router = express.Router();
const controller = require('../../controllers/authentication')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.authentication.login, controller.login);
router.delete(routes.authentication.logout, controller.logout);
router.post(routes.authentication.loginCompany, auth.authenticateToken, controller.loginCompany);
router.post(routes.authentication.loginAuto, controller.autoLogin);

module.exports = router;