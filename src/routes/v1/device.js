const express = require('express');
const router = express.Router();
const controller = require('../../controllers/device')
const auth = require('../../middlewares/authentication');

router.get('/devices', auth.authenticateToken, controller.getDevices);
router.post('/devices', auth.authenticateToken, controller.CreateDevice);
router.get('/devices/:deviceId', auth.authenticateToken, controller.GetDeviceById);
router.put('/devices/:deviceId', auth.authenticateToken, controller.UpdateDevice);
router.delete('/devices/:deviceId', auth.authenticateToken, controller.DeleteDevice);
router.get('/devices/:deviceId/projects', auth.authenticateToken, controller.GetProjectsByDeviceId);
router.post('/devices/:deviceId/projects', auth.authenticateToken, controller.SaveProjectsIntoDevice);

module.exports = router;