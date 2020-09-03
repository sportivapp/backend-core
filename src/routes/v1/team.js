const express = require('express');
const router = express.Router();
const controller = require('../../controllers/team')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post( routes.team.list, auth.authenticateToken, controller.createTeam);
router.post( routes.team.invite, auth.authenticateToken, controller.invite);
router.post( routes.team.add, auth.authenticateToken, controller.addUserToTeam);
router.post( routes.team.processInvitation, auth.authenticateToken, controller.processInvitation);
router.get( routes.team.list, auth.authenticateToken, controller.getTeamsByCompanyId);
router.get( routes.team.id, auth.authenticateToken, controller.getTeamDetailByCompanyId);
router.get( routes.team.member, auth.authenticateToken, controller.getTeamMemberList);


module.exports = router;