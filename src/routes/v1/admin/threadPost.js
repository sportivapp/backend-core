const router = require('../../router')
const threadPostController = require('../../../controllers/threadPost')
const auth = require('../../../middlewares/authentication')
const { routes } = require('../../../constant')

router.get(routes.comment.threadComments, auth.authenticateToken, threadPostController.getAllPostByThreadId)
router.post(routes.comment.threadComments, auth.authenticateToken, threadPostController.createPost)
router.put(routes.comment.threadPostId, auth.authenticateToken, threadPostController.updatePost);
router.delete(routes.comment.threadPostId, auth.authenticateToken, threadPostController.deletePost)

module.exports = router.expressRouter;
