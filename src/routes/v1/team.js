const express = require('express');
const router = express.Router();
const controller = require('../../controllers/team')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post( routes.team.list, auth.authenticateToken, controller.createTeam);
router.get( routes.team.list, auth.authenticateToken, controller.getTeams);
router.get( routes.team.id, auth.authenticateToken, controller.getTeamDetail);
router.post( routes.team.member, auth.authenticateToken, controller.getTeamMemberList);

router.post( routes.team.invite, auth.authenticateToken, controller.invite);
router.post( routes.team.add, auth.authenticateToken, controller.addUserToTeam);
router.post( routes.team.processInvitation, auth.authenticateToken, controller.processInvitation);


module.exports = router;