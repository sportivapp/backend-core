const router = require('../mobileRouter');
const controller = require('../../../controllers/mobileTeamLog')
const auth = require('../../../middlewares/authentication');

router.get('/team/:teamId/pending', auth.authenticateToken, controller.getPendingTeamLogs);
router.get('/team-user-pending', auth.authenticateToken, controller.getPendingUserLogs);

router.post('/team/:teamId/apply', auth.authenticateToken, controller.applyTeam);
router.delete('/team-log/user-cancel', auth.authenticateToken, controller.cancelRequests);
router.put('/team-log/team-process', auth.authenticateToken, controller.processRequests);

router.post('/team/:teamId/invite', auth.authenticateToken, controller.invite);
router.delete('/team-log/cancel-invite', auth.authenticateToken, controller.cancelInvites);
router.put('/team-log/user-process', auth.authenticateToken, controller.processInvitations);

module.exports = router.expressRouter;