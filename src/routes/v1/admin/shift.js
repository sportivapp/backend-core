const router = require('../router')
const shiftController = require('../../../controllers/shift');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post(routes.shift.list, auth.authenticateToken, shiftController.createShift);
router.get(routes.shift.list, auth.authenticateToken, shiftController.getAllShift);
router.get(routes.shift.id, auth.authenticateToken, shiftController.getShiftById);
router.put(routes.shift.id, auth.authenticateToken, shiftController.updateShiftById);
router.delete(routes.shift.id, auth.authenticateToken, shiftController.deleteShiftById);

module.exports = router.expressRouter;