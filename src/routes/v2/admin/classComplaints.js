const router = require('../router');
const controller = require('../../../controllers/v2/classComplaints')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');

router.put(routes.classComplaint.coachAcceptComplaint, auth.authenticateToken, controller.coachAcceptComplaint);
router.put(routes.classComplaint.coachRejectComplaint, auth.authenticateToken, controller.coachRejectComplaint);

module.exports = router.expressRouter;