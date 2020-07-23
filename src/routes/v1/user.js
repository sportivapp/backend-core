const express = require('express');
const router = express.Router();
const { Create, Login , List, ChangePassword} = require('../../controllers/user');
const auth = require('../../middlewares/authentication');
const multer = require('multer');
const Template = require('../../controllers/user/Template');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage })

router.post('/user', auth.authenticateToken, upload.single('employee'), Create);
router.post('/user-login', Login);
router.get('/user-list', List);
router.get('/user-import-template', Template);
router.put('/user-change-password', auth.authenticateToken, ChangePassword);

module.exports = router;