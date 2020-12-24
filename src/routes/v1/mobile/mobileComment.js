const router = require('../../mobileRouter');
const controller = require('../../../controllers/mobileComment')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post(routes.comment.list, auth.authenticateToken, controller.createComment);
router.put(routes.comment.id, auth.authenticateToken, controller.updateComment);
router.get(routes.comment.threadComments, auth.authenticateToken, controller.getAllComments);
router.get(routes.comment.id, auth.authenticateToken, controller.getCommentById);
router.delete(routes.comment.id, auth.authenticateToken, controller.deleteComment);
router.get(routes.comment.idThread, auth.authenticateToken, controller.getThreadDetailByCommentId);

module.exports = router.expressRouter;