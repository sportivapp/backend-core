const router = require('../router');
const projectController = require('../../controllers/project');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.project.list, auth.authenticateToken, projectController.createProject);
router.get(routes.project.list, auth.authenticateToken, projectController.getProjects);
router.get(routes.project.id, auth.authenticateToken, projectController.getProjectById);
router.put(routes.project.id, auth.authenticateToken, projectController.updateProjectById);
router.delete(routes.project.id, auth.authenticateToken, projectController.deleteProjectById);
router.post(routes.project.timesheet, auth.authenticateToken, projectController.saveTimesheet);
router.get('/project/:projectId/devices', auth.authenticateToken, projectController.getDevicesByProjectId);
router.post('/project/:projectId/devices', auth.authenticateToken, projectController.saveDevicesIntoProject);

module.exports = router.expressRouter;