const router = require('../router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/class');

router.post(routes.classV2.list, auth.authenticateToken, controller.createClass);
router.get(routes.classV2.list, auth.authenticateToken, controller.getClasses);
router.get(routes.classV2.id, auth.authenticateToken, controller.getClass);
router.get(routes.classV2.idCategory, auth.authenticateToken, controller.getClassCategory);
router.delete(routes.classV2.id, auth.authenticateToken, controller.deleteClass);
router.put(routes.classV2.reschedule, auth.authenticateToken, controller.reschedule);
router.get(routes.classV2.participants, auth.authenticateToken, controller.getClassParticipants);
router.get(routes.classV2.coaches, auth.authenticateToken, controller.getClassCoaches);
router.put(routes.classV2.idCategory, auth.authenticateToken, controller.updateCategory);
router.delete(routes.classV2.idCategory, auth.authenticateToken, controller.deleteCategory);
router.post(routes.classV2.listCategory, auth.authenticateToken, controller.addCategory);
router.put(routes.classV2.id, auth.authenticateToken, controller.updateClass);

module.exports = router.expressRouter;