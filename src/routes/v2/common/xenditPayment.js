const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const xenditPaymentAuth = require('../../../middlewares/xenditPaymentAuthentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/xenditPayment');

router.get(routes.xendit.channels, auth.authenticateToken, controller.getPaymentChannels);
router.post(routes.xendit.receivePayment, xenditPaymentAuth.checkCallbackToken, controller.receivePayment);

module.exports = router.expressRouter;