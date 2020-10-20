const router = require('../router')
const threadController = require('../../controllers/thread')
const auth = require('../../middlewares/authentication')
const { routes } = require('../../constant')

router.get(routes.thread.list, auth.authenticateToken, threadController.getAllThreads)
router.post(routes.thread.list, auth.authenticateToken, threadController.createThread)
router.get(routes.thread.id, auth.authenticateToken, threadController.getThreadById);
router.put(routes.thread.id, auth.authenticateToken, threadController.updateThread);
router.delete(routes.thread.id, auth.authenticateToken, threadController.deleteThreadById)

module.exports = router.expressRouter;
