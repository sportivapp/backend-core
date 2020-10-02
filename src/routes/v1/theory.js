const router = require('../router')
const theoryController = require('../../controllers/theory')
const auth = require('../../middlewares/authentication')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const temp = `${process.env.TEMP_DIRECTORY}`
        cb(null, temp);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({storage: storage})
const { routes } = require('../../constant')

router.get( routes.theory.list, auth.authenticateToken, theoryController.getTheoryList)
router.post( routes.theory.list, auth.authenticateToken, upload.single('file'), theoryController.createTheory)
router.get( routes.theory.download, auth.authenticateToken, theoryController.downloadTheory);
router.get( routes.theory.preview, auth.authenticateToken, theoryController.previewTheory);
router.delete( routes.theory.remove, auth.authenticateToken, theoryController.deleteTheoryByFileId)

module.exports = router.expressRouter;
