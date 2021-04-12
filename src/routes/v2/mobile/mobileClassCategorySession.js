const router = require('../mobileRouter');
const controller = require('../../../controllers/v2/mobileClassCategorySession')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post(routes.classCategorySession.absence, auth.authenticateToken, controller.inputAbsence);
router.get(routes.classCategorySession.participants, auth.authenticateToken, controller.getSessionParticipants);
router.put(routes.classCategorySession.confirm, auth.authenticateToken, controller.confirmParticipation);
router.post(routes.classCategorySession.rate, auth.authenticateToken, controller.rate);
router.post(routes.classCategorySession.reason, auth.authenticateToken, controller.reason);
router.post(routes.classCategorySession.complaint, auth.authenticateToken, controller.complaintSession);
router.get(routes.classCategorySession.participantsHistory, auth.authenticateToken, controller.sessionParticipantsHistory);

module.exports = router.expressRouter;