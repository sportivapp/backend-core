const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const xenditPaymentAuth = require('../../../middlewares/xenditPaymentAuthentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/xenditPayment');

router.get(routes.xendit.channels, auth.authenticateToken, controller.getPaymentChannels);
router.post(routes.xendit.receivePayment, xenditPaymentAuth.checkCallbackToken, controller.receivePayment);
router.post(routes.xendit.invoice, auth.authenticateToken, controller.getInvoiceStatus);
router.get(routes.xendit.awaitingPayments, auth.authenticateToken, controller.getAwaitingPayments);
router.get(routes.xendit.paymentDetail, auth.authenticateToken, controller.getPaymentDetail);

module.exports = router.expressRouter;