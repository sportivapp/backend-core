const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileTeam')
const auth = require('../../middlewares/authentication');

router.get('/team', auth.authenticateToken, controller.getTeams);
router.get('/team/:teamId', auth.authenticateToken, controller.getTeam);
router.post('/team', auth.authenticateToken, controller.createTeam);
router.put('/team/:teamId', auth.authenticateToken, controller.updateTeam);

router.get('/team/:teamId/process-user/:userId', auth.authenticateToken, controller.processRequest);
router.get('/team/:teamId/cancel', auth.authenticateToken, controller.cancelRequest);
router.get('/team/:teamId/process', auth.authenticateToken, controller.processInvitation);

module.exports = router;