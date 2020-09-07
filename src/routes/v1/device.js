const router = require('../router')
const controller = require('../../controllers/device')
const auth = require('../../middlewares/authentication')
const { routes } = require('../../constant')

router.get( routes.device.list, auth.authenticateToken, controller.getDevices);
router.post( routes.device.list, auth.authenticateToken, controller.createDevice);
router.get( routes.device.deviceId, auth.authenticateToken, controller.getDeviceById);
router.put( routes.device.deviceId, auth.authenticateToken, controller.updateDevice);
router.delete( routes.device.deviceId, auth.authenticateToken, controller.deleteDevice);
router.get( routes.device.deviceProjectId, auth.authenticateToken, controller.getProjectsByDeviceId);
router.post( routes.device.deviceProjectId, auth.authenticateToken, controller.saveProjectsIntoDevice);

module.exports = router.expressRouter;