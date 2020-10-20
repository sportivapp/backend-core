const router = require('../router')
const controller = require('../../controllers/mobileForum');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant') //TODO: being used later, to avoid constant conflict

router.post( '/mobile/thread', auth.authenticateToken, controller.createThread);
router.put( '/mobile/thread/:threadId', auth.authenticateToken, controller.updateThreadById);
router.get( '/mobile/thread', auth.authenticateToken, controller.getThreadList);
router.get( '/mobile/thread/:threadId', auth.authenticateToken, controller.getThreadDetailById);
router.delete( '/mobile/thread/:threadId', auth.authenticateToken, controller.deleteThreadById);
router.get('/thread-companies', auth.authenticateToken, controller.getMyOrganizationListWithAccess)
router.get('/thread-teams', auth.authenticateToken, controller.getMyTeamListWithAccess)

module.exports = router.expressRouter;