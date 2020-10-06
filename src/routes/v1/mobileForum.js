const router = require('../router')
const controller = require('../../controllers/mobileForum');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant') // being used later, to avoid constant conflict

router.get( '/thread', auth.authenticateToken, controller.getThreadList);
router.get( '/thread/:threadId', auth.authenticateToken, controller.getThreadDetailById);

module.exports = router.expressRouter;