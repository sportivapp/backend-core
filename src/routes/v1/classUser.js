const express = require('express');
const router = express.Router();
const controller = require('../../controllers/classUser')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.classUser.list, auth.authenticateToken, controller.getRegisteredUsersByClassId)
router.post(routes.classUser.pending, auth.authenticateToken, controller.getUsersPendingListByClassId)
router.post(routes.classUser.registration, auth.authenticateToken, controller.processRegistration)

module.exports = router;