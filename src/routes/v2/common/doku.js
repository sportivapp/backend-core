//FILE TO DELETE IF PAYMENT SEPARATED
const router = require('../commonRouter');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/doku');

router.get(routes.doku.notify, controller.notifyDokuRequest);

module.exports = router.expressRouter;