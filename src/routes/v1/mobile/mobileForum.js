const router = require('../mobileRouter');
const controller = require('../../../controllers/mobileForum');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post( routes.thread.list, auth.authenticateToken, controller.createThread);
router.put( routes.thread.id, auth.authenticateToken, controller.updateThreadById);
router.get( routes.thread.list, auth.authenticateToken, controller.getThreadList);
router.get( routes.thread.id, auth.authenticateToken, controller.getThreadDetailById);
router.delete( routes.thread.id, auth.authenticateToken, controller.deleteThreadById);
router.get('/thread-companies', auth.authenticateToken, controller.getMyOrganizationListWithAccess)
router.get('/thread-teams', auth.authenticateToken, controller.getMyTeamListWithAccess)
router.get(routes.thread.moderator, auth.authenticateToken, controller.isThreadModerator);

module.exports = router.expressRouter;