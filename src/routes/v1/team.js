const express = require('express');
const router = express.Router();
const controller = require('../../controllers/team')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.get( routes.team.list, auth.authenticateToken, controller.getTeams);
router.get( routes.team.id, auth.authenticateToken, controller.getTeamDetail);
router.post( routes.team.list, auth.authenticateToken, controller.createTeam);
router.post( routes.team.join, auth.authenticateToken, controller.joinTeam);
router.post( routes.team.exit, auth.authenticateToken, controller.exitTeam)
router.post( routes.team.cancelInvitation, auth.authenticateToken, controller.cancelInvite);
router.post( routes.team.processRequest, auth.authenticateToken, controller.processRequest);
router.get( routes.team.members, auth.authenticateToken, controller.getTeamMemberList);
router.get( routes.team.teamLog, auth.authenticateToken, controller.getTeamMemberByLogType);
router.post( routes.team.invite, auth.authenticateToken, controller.invite);
router.put( routes.team.position, auth.authenticateToken, controller.changeTeamMemberPosition);
router.put( routes.team.id, auth.authenticateToken, controller.updateTeam);
router.post( routes.team.kick, auth.authenticateToken, controller.kickUserFromTeam);
router.post( routes.team.cancelRequest, auth.authenticateToken, controller.cancelRequest)
router.post( routes.team.processInvitation, auth.authenticateToken, controller.processInvitation);
router.get(routes.team.invite, auth.authenticateToken, controller.getMembersToInvite);
router.delete(routes.team.id, auth.authenticateToken, controller.deleteTeam);

module.exports = router;