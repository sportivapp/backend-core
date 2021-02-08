const router = require('../router')
const threadPostReplyController = require('../../../controllers/threadPostReply')
const auth = require('../../../middlewares/authentication')
const { routes } = require('../../../constant')

router.get(routes.commentReply.list, auth.authenticateToken, threadPostReplyController.getAllReplyByThreadPostId)
router.post(routes.commentReply.list, auth.authenticateToken, threadPostReplyController.createReply)
router.put(routes.commentReply.id, auth.authenticateToken, threadPostReplyController.editReply);
router.delete(routes.commentReply.id, auth.authenticateToken, threadPostReplyController.deleteReply)

module.exports = router.expressRouter;
