const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileComment')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.comment.list, auth.authenticateToken, controller.createComment);
router.put(routes.comment.id, auth.authenticateToken, controller.updateComment);
router.get(routes.comment.commentList, auth.authenticateToken, controller.getAllComments);
router.delete(routes.comment.id, auth.authenticateToken, controller.deleteComment);

module.exports = router;