const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileTeam')
const auth = require('../../middlewares/authentication');

router.get('/team', auth.authenticateToken, controller.getTeams);
router.get('/team/:teamId', auth.authenticateToken, controller.getTeam);
router.post('/team', auth.authenticateToken, controller.createTeam);
router.post('/team-join', auth.authenticateToken, controller.joinTeam);
router.post('/team-exit', auth.authenticateToken, controller.exitTeam);
router.post('/team-cancel-invite', auth.authenticateToken, controller.cancelInvite);
router.post('/team-process-request', auth.authenticateToken, controller.processRequest);
router.post('/team-invite', auth.authenticateToken, controller.invite);
router.post('/team-change-permission', auth.authenticateToken, controller.changeTeamMemberPosition);
router.post('/team-kick', auth.authenticateToken, controller.kick);
// cancel apply
// accept/reject team invitation

module.exports = router;