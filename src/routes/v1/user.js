const express = require('express');
const router = express.Router();
const { Create, Login } = require('../../controllers/user');
const auth = require('../../middlewares/authentication');
const multer = require('multer');
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

module.exports = router;