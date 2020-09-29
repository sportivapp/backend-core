const express = require('express');
const router = express.Router();
const controller = require('../../controllers/classUser')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get(routes.classUser.classUser, auth.authenticateToken, controller.getRegisteredUsersByClassId)
router.get(routes.classUser.pendingUser, auth.authenticateToken, controller.getUsersPendingListByClassId)
router.post(routes.classUser.processRegistration, auth.authenticateToken, controller.processRegistration)

module.exports = router;