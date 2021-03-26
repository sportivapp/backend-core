const router = require('../router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/classCategory');

router.post(routes.classCategory.extend, auth.authenticateToken, controller.extend);
router.get(routes.classCategory.schedule, auth.authenticateToken, controller.getSchedules);
router.get(routes.classCategory.complaints, auth.authenticateToken, controller.getCategoryComplaints);

module.exports = router.expressRouter;