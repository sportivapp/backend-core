const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const paymentAuth = require('../../../middlewares/paymentAuthentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/payment');

router.get(routes.payment.methods, auth.authenticateToken, controller.getPaymentMethods);
router.put(routes.payment.invoiceUpdate, paymentAuth.checkAPIKey, controller.updatePayment);

module.exports = router.expressRouter;