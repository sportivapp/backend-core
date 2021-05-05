//FILE TO DELETE IF PAYMENT SEPARATED
const router = require('../commonRouter');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/bca');

router.post(routes.bca.bills, controller.getAllPaymentBills);
router.post(routes.bca.oauth, controller.getOauthToken);
router.post(routes.bca.invocation, controller.receivePaymentInvocation);

module.exports = router.expressRouter;