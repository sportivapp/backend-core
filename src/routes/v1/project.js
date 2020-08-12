const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/project');
const auth = require('../../middlewares/authentication');

router.post('/project', auth.authenticateToken, projectController.createProject);
router.get('/project', auth.authenticateToken, projectController.getProjects);
router.put('/project/:projectId', auth.authenticateToken, projectController.updateProjectById);
router.delete('/project/:projectId', auth.authenticateToken, projectController.deleteProjectById);
router.get('/project/:projectId/devices', auth.authenticateToken, projectController.getDevicesByProjectId);
router.post('/project/:projectId/devices', auth.authenticateToken, projectController.saveDevicesIntoProject);

module.exports = router;