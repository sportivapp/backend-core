const express = require('express');
const router = express.Router();
const controller = require('../../controllers/team')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get( routes.team.list, auth.authenticateToken, controller.getTeams);
router.get( routes.team.id, auth.authenticateToken, controller.getTeamDetail);
router.post( routes.team.list, auth.authenticateToken, controller.createTeam);

router.post( routes.team.join, auth.authenticateToken, controller.joinTeam);

router.post( routes.team.processRequest, auth.authenticateToken, controller.processRequest);
router.get( routes.team.member, auth.authenticateToken, controller.getTeamMemberList);
router.post( routes.team.invite, auth.authenticateToken, controller.invite);
router.put( routes.team.position, auth.authenticateToken, controller.changeTeamMemberPosition);
router.delete( routes.team.member, auth.authenticateToken, controller.kick);

router.post( routes.team.processInvitation, auth.authenticateToken, controller.processInvitation);

module.exports = router;