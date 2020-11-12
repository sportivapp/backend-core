const router = require('../router')
const tournamentController = require('../../controllers/tournament');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get( routes.tournament.companies, auth.authenticateToken, tournamentController.getAllCompaniesByCreatePermission);

module.exports = router.expressRouter;