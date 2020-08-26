const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileApplyInvite')
const auth = require('../../middlewares/authentication');

router.get('/apply', auth.authenticateToken, controller.getApplyInvite);
router.post('/apply', auth.authenticateToken, controller.joinRequest);
router.post('/apply-cancel', auth.authenticateToken, controller.cancelJoinRequest);
router.post('/invite-process', auth.authenticateToken, controller.processInvite);

module.exports = router;