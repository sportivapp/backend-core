const router = require('../mobileRouter');
const controller = require('../../../controllers/v2/mobileClassCategory')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get(routes.classCategory.myCategory, auth.authenticateToken, controller.getMyCategory);
router.get(routes.classCategory.idCoach, auth.authenticateToken, controller.getCoachCategory);
router.get(routes.classCategory.startSession, auth.authenticateToken, controller.startSession);
router.get(routes.classCategory.endSession, auth.authenticateToken, controller.endSession);
router.put(routes.classCategory.reschedule, auth.authenticateToken, controller.reschedule);
router.get(routes.classCategory.unconfirmed, auth.authenticateToken, controller.getMyUnconfirmedSessions);
router.get(routes.classCategory.bookable, auth.authenticateToken, controller.getBookableSessions);
router.get(routes.classCategory.myHistory, auth.authenticateToken, controller.mySessionsHistory);
router.get(routes.classCategory.participantsHistory, auth.authenticateToken, controller.categoryParticipantsHistory);
router.get(routes.classCategory.complaints, auth.authenticateToken, controller.getCategoryComplaints);
router.get(routes.classCategory.monthPicker, auth.authenticateToken, controller.getMonthPicker);
router.get(routes.classCategory.history, auth.authenticateToken, controller.getCategoryHistory);

module.exports = router.expressRouter;