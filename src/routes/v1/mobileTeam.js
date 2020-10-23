const router = require('../mobileRouter');
const controller = require('../../controllers/mobileTeam')
const auth = require('../../middlewares/authentication');

router.get('/team', auth.authenticateToken, controller.getTeams);
router.get('/team/:teamId', auth.authenticateToken, controller.getTeam);
router.post('/team', auth.authenticateToken, controller.createTeam);
router.put('/team/:teamId', auth.authenticateToken, controller.updateTeam);
router.delete('/team/:teamId', auth.authenticateToken, controller.deleteTeam);
router.get('/my-team', auth.authenticateToken, controller.getMyTeams);

module.exports = router.expressRouter;