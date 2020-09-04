require('dotenv').config();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const temp = `${process.env.TEMP_DIRECTORY}`;
        cb(null, temp);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/file');
const auth = require('../../middlewares/authentication');

router.post('/file', auth.authenticateToken, upload.single('file'), controller.createFile);
router.post('/files', auth.authenticateToken, upload.array('files', 5), controller.createMultipleFiles);
router.get('/file-preview/:fileId', auth.authenticateToken, controller.previewFile);
router.get('/self-file-preview/:fileId', auth.authenticateToken, controller.previewFileRestricted);

module.exports = router;