const router = require('../../mobileRouter');
const controller = require('../../../controllers/mobileClass')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get(routes.class.list, auth.authenticateToken, controller.getAllClassByCompanyId);
router.post(routes.class.list, auth.authenticateToken, controller.createClass);
router.get(routes.class.id, auth.authenticateToken, controller.getClassById);
router.put(routes.class.id, auth.authenticateToken, controller.updateClassById);
router.delete(routes.class.id, auth.authenticateToken, controller.deleteClassById);

module.exports = router.expressRouter;