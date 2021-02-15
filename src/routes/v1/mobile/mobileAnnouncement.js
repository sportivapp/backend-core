const router = require('../mobileRouter');
const controller = require('../../../controllers/mobileAnnouncement');
const auth = require('../../../middlewares/authentication');

router.get('/announcement', auth.authenticateToken, controller.getAnnouncements);
router.get('/announcement/:announcementId', auth.authenticateToken, controller.getAnnouncement);

module.exports = router.expressRouter;