const router = require('../../v2/router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/verify');

router.post(routes.verifyV2.token, controller.verifyCMSToken);

module.exports = router.expressRouter;