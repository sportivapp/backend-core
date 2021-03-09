const router = require('../mobileRouter');
const controller = require('../../../controllers/v2/mobileClass')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get(routes.classV2.list, auth.authenticateToken, controller.getClasses);
router.get(routes.classV2.id, auth.authenticateToken, controller.getClass);
router.get(routes.classV2.idCategory, auth.authenticateToken, controller.getClassCategory);
router.post(routes.classV2.register, auth.authenticateToken, controller.register);
router.get(routes.classV2.myClass, auth.authenticateToken, controller.getMyClass);
router.get(routes.classV2.coachClass, auth.authenticateToken, controller.getCoachClass);
router.get(routes.classV2.listCategory, auth.authenticateToken, controller.getCategories);

module.exports = router.expressRouter;