const router = require('../router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/classCategory');

router.post(routes.classCategory.extend, auth.authenticateToken, controller.extend);

module.exports = router.expressRouter;