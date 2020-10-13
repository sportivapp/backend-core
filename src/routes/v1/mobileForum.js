const router = require('../router')
const controller = require('../../controllers/mobileForum');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant') //TODO: being used later, to avoid constant conflict

router.post( '/thread', auth.authenticateToken, controller.createThread);
router.put( '/thread/:threadId', auth.authenticateToken, controller.updateThreadById);
router.get( '/thread', auth.authenticateToken, controller.getThreadList);
router.get( '/thread/:threadId', auth.authenticateToken, controller.getThreadDetailById);
router.delete( '/thread/:threadId', auth.authenticateToken, controller.deleteThreadById);

module.exports = router.expressRouter;