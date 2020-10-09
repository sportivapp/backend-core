const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileTeamLog')
const auth = require('../../middlewares/authentication');

router.post('/team/:teamId/apply', auth.authenticateToken, controller.applyTeam);
router.get('/team/:teamId/pending', auth.authenticateToken, controller.getPendingTeamLogs);
router.get('/team/:teamId/user-pending', auth.authenticateToken, controller.getPendingUserLogs);
router.post('/team/:teamId/invite', auth.authenticateToken, controller.invite);
router.delete('/team-log/:teamLogId/invite', auth.authenticateToken, controller.cancelInvite);

module.exports = router;