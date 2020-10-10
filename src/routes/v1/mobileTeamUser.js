const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileTeamUser')
const auth = require('../../middlewares/authentication');

router.delete('/team/:teamId/exit', auth.authenticateToken, controller.exitTeam);
router.get('/team/:teamId/members', auth.authenticateToken, controller.getTeamMemberList);
router.put('/team/:teamId/position/:position', auth.authenticateToken, controller.changeTeamMemberPosition);
router.delete('/team/:teamId/kick', auth.authenticateToken, controller.kickMember);
router.get('/team/:teamId/admin', auth.authenticateToken, controller.isAdmin);

module.exports = router;