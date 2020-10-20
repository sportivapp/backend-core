const express = require('express');
const router = express.Router();
const controller = require('../../controllers/team')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.get( routes.team.list, auth.authenticateToken, controller.getTeams);
router.get( routes.team.myTeam, auth.authenticateToken, controller.getMyTeamList);
router.get( routes.team.id, auth.authenticateToken, controller.getTeamDetail);
router.post( routes.team.list, auth.authenticateToken, controller.createTeam);
router.post( routes.team.join, auth.authenticateToken, controller.joinTeam);
router.post( routes.team.exit, auth.authenticateToken, controller.exitTeam)
router.post( routes.team.cancelInvitation, auth.authenticateToken, controller.cancelInvites);
router.post( routes.team.processRequest, auth.authenticateToken, controller.processRequests);
router.get( routes.team.members, auth.authenticateToken, controller.getTeamMemberList);
router.get( routes.team.teamLog, auth.authenticateToken, controller.getTeamMemberByLogType);
router.get( routes.team.userPendingLog, auth.authenticateToken, controller.getUserTeamPendingListByLogType);
router.post( routes.team.invite, auth.authenticateToken, controller.invite);
router.put( routes.team.roles, auth.authenticateToken, controller.changeTeamMemberSportRoles);
router.put( routes.team.position, auth.authenticateToken, controller.changeTeamMemberPosition);
router.put( routes.team.id, auth.authenticateToken, controller.updateTeam);
router.post( routes.team.kick, auth.authenticateToken, controller.kickUserFromTeam);
router.post( routes.team.cancelRequest, auth.authenticateToken, controller.cancelRequests)
router.post( routes.team.processInvitation, auth.authenticateToken, controller.processInvitations);
router.get(routes.team.invite, auth.authenticateToken, controller.getMembersToInvite);
router.delete(routes.team.id, auth.authenticateToken, controller.deleteTeam);

module.exports = router;