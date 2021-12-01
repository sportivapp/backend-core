const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/disbursementRequest');
const withdrawAuth = require('../../../middlewares/withdrawAuthentication');

router.post(routes.disbursementRequest.create, auth.authenticateToken, controller.createDisbursementRequest);
router.post(routes.disbursementRequest.withdrawn, withdrawAuth.checkWithdrawToken, controller.withdrawnDisbursementRequest);

module.exports = router.expressRouter;