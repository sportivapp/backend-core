const router = require('../router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')
const controller = require('../../../controllers/class')

router.post(routes.class.list, auth.authenticateToken, controller.createClass);
router.get(routes.class.id, auth.authenticateToken, controller.getClassById);
router.put(routes.class.id, auth.authenticateToken, controller.updateClassById);
router.delete(routes.class.id, auth.authenticateToken, controller.deleteClassById);
router.get(routes.class.list, auth.authenticateToken, controller.getAllClassByCompanyId);

module.exports = router.expressRouter;