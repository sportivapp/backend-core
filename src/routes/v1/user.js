const router = require('../router');
const userController = require('../../controllers/user');
const auth = require('../../middlewares/authentication');
const uploadPath = require('../../../uploads');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage })
const { routes } = require('../../constant')

router.post('/user', auth.authenticateToken, upload.single('employee'), userController.registerEmployees);
router.post( routes.user.create, auth.authenticateToken, userController.createUser);
router.post(routes.user.login, userController.login);
router.post(routes.user.forgot, userController.forgotPassword);
router.get('/user/:companyId', auth.authenticateToken, userController.getAllUserByCompanyId);
router.get('/user-import-template', userController.importTemplate);
router.put( routes.user.password, auth.authenticateToken, userController.changePassword);
router.delete('/user/:userId', auth.authenticateToken, userController.deleteUserById);

module.exports = router.expressRouter;