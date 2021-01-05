const router = require('../../router')
const notificationController= require('../../../controllers/notification');
const { routes } = require('../../../constant')

router.post(routes.notification.list, notificationController.createNotification);

module.exports = router.expressRouter;