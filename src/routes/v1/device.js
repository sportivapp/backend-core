const express = require('express');
const router = express.Router();
const controller = require('../../controllers/device')
const auth = require('../../middlewares/authentication');

router.get('/devices', auth.authenticateToken, controller.getDevices);
router.post('/devices', auth.authenticateToken, controller.createDevice);
router.get('/devices/:deviceId', auth.authenticateToken, controller.getDeviceById);
router.put('/devices/:deviceId', auth.authenticateToken, controller.updateDevice);
router.delete('/devices/:deviceId', auth.authenticateToken, controller.deleteDevice);
router.get('/devices/:deviceId/projects', auth.authenticateToken, controller.getProjectsByDeviceId);
router.post('/devices/:deviceId/projects', auth.authenticateToken, controller.saveProjectsIntoDevice);

module.exports = router;