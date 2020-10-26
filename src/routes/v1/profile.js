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
router.get(routes.profile.modules, auth.authenticateToken, profileController.getModules)
router.get(routes.profile.functions, auth.authenticateToken, profileController.getAllFunctions)

module.exports = router.expressRouter;