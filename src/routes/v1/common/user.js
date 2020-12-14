require('dotenv').config();
const router = require('../../router');
const userController = require('../../../controllers/user');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post( routes.user.register, userController.register);
router.post( routes.user.create, auth.authenticateToken, userController.createUser);
router.post( routes.user.login, userController.login);
router.post( routes.user.forgot, userController.forgotPassword);
router.get( routes.user.list, auth.authenticateToken, userController.getAllUserByCompanyId);
router.get( routes.user.import, userController.importTemplate);
router.get( routes.user.id , auth.authenticateToken, userController.getUserById);
router.post( routes.user.profile, auth.authenticateToken, userController.getOtherUserById);
router.put( routes.user.id , auth.authenticateToken, userController.updateUserById);
router.delete( routes.user.id , auth.authenticateToken, userController.deleteUserById);

module.exports = router.expressRouter;