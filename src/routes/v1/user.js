require('dotenv').config();
const router = require('../router');
const userController = require('../../controllers/user');
const auth = require('../../middlewares/authentication');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOADS_DIRECTORY);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage })
const { routes } = require('../../constant')

router.post( routes.user.register, auth.authenticateToken, upload.single('employee'), userController.registerEmployees);
router.post( routes.user.create, auth.authenticateToken, userController.createUser);
router.post( routes.user.login, userController.login);
router.post( routes.user.forgot, userController.forgotPassword);
router.get( routes.user.list, auth.authenticateToken, userController.getAllUserByCompanyId);
router.get( routes.user.import, userController.importTemplate);
router.get( routes.user.id , auth.authenticateToken, userController.getUserById);
router.put( routes.user.id , auth.authenticateToken, userController.updateUserById);
router.delete( routes.user.id , auth.authenticateToken, userController.deleteUserById);

module.exports = router.expressRouter;