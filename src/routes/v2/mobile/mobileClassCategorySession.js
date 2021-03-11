const router = require('../mobileRouter');
const controller = require('../../../controllers/v2/mobileClassCategorySession')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post(routes.classCategorySession.absence, auth.authenticateToken, controller.inputAbsence);
router.get(routes.classCategorySession.participants, auth.authenticateToken, controller.getSessionParticipants);
router.put(routes.classCategorySession.confirm, auth.authenticateToken, controller.confirmParticipation);

module.exports = router.expressRouter;