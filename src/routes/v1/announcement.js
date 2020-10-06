const router = require('../router');
const announcementController = require('../../controllers/announcement')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post( routes.announcement.create, auth.authenticateToken, announcementController.createAnnouncement);
router.get( routes.announcement.id, auth.authenticateToken, announcementController.getAnnouncementById);
router.get( routes.announcement.list, auth.authenticateToken, announcementController.getAllAnnouncement);
router.put( routes.announcement.id, auth.authenticateToken, announcementController.updateAnnouncement);
router.delete( routes.announcement.id, auth.authenticateToken, announcementController.deleteAnnouncement);
router.post(routes.announcement.publish, auth.authenticateToken, announcementController.publishAnnouncement);

module.exports = router.expressRouter;