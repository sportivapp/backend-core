const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/disbursement');

router.get(routes.disbursement.myDisbursementAmount, auth.authenticateToken, controller.getMyDisbursementAmount);

module.exports = router.expressRouter;