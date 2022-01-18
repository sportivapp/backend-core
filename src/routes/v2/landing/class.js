const router = require('../landingRouter');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/landingClass');

router.get(routes.classV2.list, auth.authenticateToken, controller.getClasses);
router.post(routes.classV2.list, auth.authenticateToken, controller.createClass);
router.get(routes.classV2.myCreatedClass, auth.authenticateToken, controller.getMyCreatedClasses);

module.exports = router.expressRouter;