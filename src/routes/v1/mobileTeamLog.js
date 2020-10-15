const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileTeamLog')
const auth = require('../../middlewares/authentication');

router.get('/team/:teamId/pending', auth.authenticateToken, controller.getPendingTeamLogs);
router.get('/team-user-pending', auth.authenticateToken, controller.getPendingUserLogs);

router.post('/team/:teamId/apply', auth.authenticateToken, controller.applyTeam);
router.delete('/team-log/:teamLogId/user-cancel', auth.authenticateToken, controller.cancelRequest);
router.put('/team-log/team-process', auth.authenticateToken, controller.processRequests);

router.post('/team/:teamId/invite', auth.authenticateToken, controller.invite);
router.delete('/team-log/:teamLogId/invite', auth.authenticateToken, controller.cancelInvite);
router.put('/team-log/:teamLogId/user-process', auth.authenticateToken, controller.processInvitation);

module.exports = router;