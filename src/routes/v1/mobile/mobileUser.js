const router = require('../../mobileRouter');
const controller = require('../../../controllers/mobileUser');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const { getIndustryByUserId } = require('../../../services/mobileUserService');

router.post( routes.user.list, controller.createUser);
router.post( routes.user.login, controller.login);
router.put( routes.user.coach, auth.authenticateToken, controller.updateUserCoachData);
router.delete( routes.user.removeCoach, auth.authenticateToken, controller.removeCoach);
router.post( routes.user.profile, auth.authenticateToken, controller.getOtherUserById);
router.get( routes.user.selfProfile, auth.authenticateToken, controller.getSelf);
router.get( routes.user.pending, auth.authenticateToken, controller.getListPendingByUserId);
router.put( routes.user.list, auth.authenticateToken, controller.updateUser);
router.get( routes.user.industry, auth.authenticateToken, controller.getIndustryByUserId );
router.put( routes.user.industry, auth.authenticateToken, controller.changeIndustryByUserId);
router.post( routes.user.changePassword, auth.authenticateToken, controller.changePassword);

module.exports = router.expressRouter;