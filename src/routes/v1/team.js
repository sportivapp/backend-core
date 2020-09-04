const express = require('express');
const router = express.Router();
const controller = require('../../controllers/team')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post( routes.team.list, auth.authenticateToken, controller.createTeam);
router.get( routes.team.list, auth.authenticateToken, controller.getTeams);
router.get( routes.team.id, auth.authenticateToken, controller.getTeamDetail);
router.get( routes.team.member, auth.authenticateToken, controller.getTeamMemberList);
router.post( routes.team.invite, auth.authenticateToken, controller.invite);
router.post( routes.team.processInvitation, auth.authenticateToken, controller.processInvitation);
router.post( routes.team.processRequest, auth.authenticateToken, controller.processRequest);
router.post( routes.team.join, auth.authenticateToken, controller.joinTeam);
router.put( routes.team.position, auth.authenticateToken, controller.changeTeamMemberPosition);
router.delete( routes.team.member, auth.authenticateToken, controller.kick);

module.exports = router;