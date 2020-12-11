const router = require('../../mobileRouter');
const controller = require('../../../controllers/mobileClassUser')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get(routes.classUser.list, auth.authenticateToken, controller.getMyClasses);
router.post(routes.classUser.registration, auth.authenticateToken, controller.registerByClassId);
router.delete(routes.classUser.id, auth.authenticateToken, controller.cancelRegistrationByClassId);
router.get(routes.classUser.history, auth.authenticateToken, controller.getHistoryClasses);
router.get(routes.classUser.historyId, auth.authenticateToken, controller.getHistoryClassById);

module.exports = router.expressRouter;