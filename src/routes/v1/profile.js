require('dotenv').config();
const router = require('../router');
const profileController = require('../../controllers/profile');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.profile.changeCompany, auth.authenticateToken, profileController.changeUserCompany);
router.get(routes.profile.currentCompany, auth.authenticateToken, profileController.getUserCurrentCompany);
router.put(routes.profile.changePassword, auth.authenticateToken, profileController.changeUserPassword);
router.put(routes.profile.profile, auth.authenticateToken, profileController.updateProfile)
router.get(routes.profile.profile, auth.authenticateToken, profileController.getProfile)

module.exports = router.expressRouter;