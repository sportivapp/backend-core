const express = require('express');
const router = express.Router();
const controller = require('../../controllers/classUser')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get(routes.class.classUser, auth.authenticateToken, controller.getRegisteredUsersByClassId)
router.get(routes.class.pendingUser, auth.authenticateToken, controller.getUsersPendingListByClassId)
router.post(routes.class.processRegistration, auth.authenticateToken, controller.processRegistration)

module.exports = router;