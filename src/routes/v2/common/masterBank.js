const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/masterBank');

router.get(routes.masterBank.list, auth.authenticateToken, controller.getAllBanks);

module.exports = router.expressRouter;