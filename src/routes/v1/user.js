const express = require('express');
const router = express.Router();
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

router.post('/user', auth.authenticateToken, upload.single('employee'), userController.registerEmployees);
router.post('/user-create', auth.authenticateToken, userController.createUser);
router.post('/user-login', userController.login);
router.post('/user-forgot-password', userController.forgotPassword);
router.get('/user/:companyId', auth.authenticateToken, userController.getAllUserByCompanyId);
router.get('/user-import-template', userController.importTemplate);
router.put('/user-change-password', auth.authenticateToken, userController.changePassword);
router.delete('/user/:userId', auth.authenticateToken, userController.deleteUserById);

module.exports = router;