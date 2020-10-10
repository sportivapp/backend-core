const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileTeam')
const auth = require('../../middlewares/authentication');

router.get('/team', auth.authenticateToken, controller.getTeams);
router.get('/team/:teamId', auth.authenticateToken, controller.getTeam);
router.post('/team', auth.authenticateToken, controller.createTeam);
router.put('/team/:teamId', auth.authenticateToken, controller.updateTeam);
router.delete('/team/:teamId', auth.authenticateToken, controller.deleteTeam);

module.exports = router;