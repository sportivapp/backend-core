const router = require('../../router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/class');

router.post(routes.classV2.list, auth.authenticateToken, controller.createClass);
router.get(routes.classV2.list, auth.authenticateToken, controller.getClasses);

module.exports = router.expressRouter;