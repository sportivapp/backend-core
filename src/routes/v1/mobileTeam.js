const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileTeam')
const auth = require('../../middlewares/authentication');

router.get('/team', auth.authenticateToken, controller.getTeams);
router.get('/team/:teamId', auth.authenticateToken, controller.getTeam);
router.post('/team', auth.authenticateToken, controller.createTeam);
router.put('/team/:teamId', auth.authenticateToken, controller.updateTeam);
router.post('/team-join', auth.authenticateToken, controller.joinTeam);
router.post('/team-exit', auth.authenticateToken, controller.exitTeam);
router.post('/team-cancel-invite', auth.authenticateToken, controller.cancelInvite);
router.post('/team-process-request', auth.authenticateToken, controller.processRequest);
router.post('/team-members', auth.authenticateToken, controller.getTeamMemberList);
router.post('/team-invite', auth.authenticateToken, controller.invite);
router.post('/team-change-permission', auth.authenticateToken, controller.changeTeamMemberPosition);
router.post('/team-kick', auth.authenticateToken, controller.kick);
router.post('/team-cancel-request', auth.authenticateToken, controller.cancelRequest);
router.post('/team-process-invitation', auth.authenticateToken, controller.processInvitation);

module.exports = router;