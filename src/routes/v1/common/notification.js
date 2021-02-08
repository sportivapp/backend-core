const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/notification');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');

router.get( routes.notification.list, auth.authenticateToken, controller.getAllNotification);
router.delete( routes.notification.list, auth.authenticateToken, controller.deleteNotificationBody);
router.get( routes.notification.count, auth.authenticateToken, controller.getNotificationCount );
router.put( routes.notification.read, auth.authenticateToken, controller.readNotification);

module.exports = router;