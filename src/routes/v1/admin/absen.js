const router = require('../router')
const absenController = require('../../../controllers/absen')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post( routes.absen.list, absenController.createAbsenByPOS );
// PLEASE REFACTOR THE GET listId CALL LATER ( CHANGE USERID TO QUERY NOT PARAMS)
router.get( routes.absen.list, absenController.listAbsen);
router.put( routes.absen.update, auth.authenticateToken, absenController.editAbsen);
router.delete( routes.absen.remove, auth.authenticateToken, absenController.deleteAbsen);

module.exports = router.expressRouter;