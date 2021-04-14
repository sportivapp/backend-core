const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/payment');

router.get(routes.payment.methods, auth.authenticateToken, controller.getPaymentMethods);

module.exports = router.expressRouter;