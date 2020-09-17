const express = require('express');
const router = express.Router();
const controller = require('../../controllers/notification');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.get( routes.notification.list, auth.authenticateToken, controller.getAllNotification);
router.get( routes.notification.body, auth.authenticateToken, controller.getAllNotificationBody);
router.delete( routes.notification.id, auth.authenticateToken, controller.deleteNotification);

module.exports = router;