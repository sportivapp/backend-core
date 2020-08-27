const router = require('../router')
const shiftController = require('../../controllers/shiftPattern');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get( routes.shiftPattern.list, auth.authenticateToken, shiftController.getPatternsByShiftId );
router.post( routes.shiftPattern.list, auth.authenticateToken, shiftController.createPattern );
router.get( routes.shiftPattern.id, auth.authenticateToken, shiftController.getPatternById );
router.put( routes.shiftPattern.id, auth.authenticateToken, shiftController.updatePatternById );
router.delete( routes.shiftPattern.id, auth.authenticateToken, shiftController.deletePatternById );

module.exports = router.expressRouter;