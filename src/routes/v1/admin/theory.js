const router = require('../router')
const theoryController = require('../../../controllers/theory')
const auth = require('../../../middlewares/authentication')
const { routes } = require('../../../constant')

router.get( routes.theory.list, auth.authenticateToken, theoryController.getTheoryList)
router.post( routes.theory.list, auth.authenticateToken, theoryController.createTheory)
router.get( routes.theory.download, auth.authenticateToken, theoryController.downloadTheory);
router.get( routes.theory.preview, auth.authenticateToken, theoryController.previewTheory);
router.delete( routes.theory.remove, auth.authenticateToken, theoryController.deleteTheoryByFileId)

module.exports = router.expressRouter;
