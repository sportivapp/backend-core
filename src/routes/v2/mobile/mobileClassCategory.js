const router = require('../mobileRouter');
const controller = require('../../../controllers/v2/mobileClassCategory')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get(routes.classCategory.myCategory, auth.authenticateToken, controller.getMyCategory);
router.get(routes.classCategory.idCoach, auth.authenticateToken, controller.getCoachCategory);
router.get(routes.classCategory.startSession, auth.authenticateToken, controller.startSession);
router.get(routes.classCategory.endSession, auth.authenticateToken, controller.endSession);

module.exports = router.expressRouter;