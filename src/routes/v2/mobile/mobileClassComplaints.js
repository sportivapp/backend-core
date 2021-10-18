const router = require('../mobileRouter');
const controller = require('../../../controllers/v2/mobileClassComplaints')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get(routes.classComplaint.myCategoryComplaints, auth.authenticateToken, controller.getMyCategoryComplaints);
router.get(routes.classComplaint.coachComplaints, auth.authenticateToken, controller.getCoachComplaints);
router.put(routes.classComplaint.coachAcceptComplaint, auth.authenticateToken, controller.coachAcceptComplaint);
router.put(routes.classComplaint.coachRejectComplaint, auth.authenticateToken, controller.coachRejectComplaint);

module.exports = router.expressRouter;