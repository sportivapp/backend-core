const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/notification');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');

router.get( routes.notification.list, auth.authenticateToken, controller.getAllNotification);
router.get( routes.notification.count, auth.authenticateToken, controller.getNotificationCount );
router.get( routes.notification.click, auth.authenticateToken, controller.clickNotification);

module.exports = router;