const router = require('../landingRouter');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/landingClass');

router.get(routes.classV2.list, auth.authenticateToken, controller.getClasses);
router.post(routes.classV2.list, auth.authenticateToken, controller.createClass);
router.get(routes.classV2.myClass, auth.authenticateToken, controller.getMyCreatedClasses);
router.get(routes.classV2.id, auth.authenticateToken, controller.getLandingClassDetail);
router.put(routes.classV2.id, auth.authenticateToken, controller.updateClass);
router.delete(routes.classV2.id, auth.authenticateToken, controller.deleteClass);
router.post(routes.classV2.listCategory, auth.authenticateToken, controller.addCategory);
router.delete(routes.classV2.idCategory, auth.authenticateToken, controller.deleteCategory);
router.get(routes.classV2.isOwner, auth.authenticateToken, controller.checkIsClassOwner);

module.exports = router.expressRouter;