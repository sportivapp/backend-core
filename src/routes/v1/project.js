const express = require('express');
const router = express.Router();
const { Create, List, Edit, Delete, DeviceListByProjectId, SaveDeviceByProjectId } = require('../../controllers/project');
const auth = require('../../middlewares/authentication');

router.post('/project', auth.authenticateToken, Create);
router.get('/project', auth.authenticateToken, List);
router.put('/project/:projectId', auth.authenticateToken, Edit);
router.delete('/project/:projectId', auth.authenticateToken, Delete);
router.get('/project/:projectId/devices', auth.authenticateToken, DeviceListByProjectId);
router.post('/project/:projectId/devices', auth.authenticateToken, SaveDeviceByProjectId);

module.exports = router;