const express = require('express');
const router = express.Router();
const { Create, Login , List, Template, ChangePassword, Delete, ForgotPassword} = require('../../controllers/user');
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

router.post('/user', auth.authenticateToken, upload.single('employee'), Create);
router.post('/user-login', Login);
router.post('/user-forgot-password', ForgotPassword);
router.get('/user-list/:companyId', auth.authenticateToken, List);
router.get('/user-import-template', Template);
router.put('/user-change-password', auth.authenticateToken, ChangePassword);
router.delete('/user-delete/:userId', auth.authenticateToken, Delete);

module.exports = router;