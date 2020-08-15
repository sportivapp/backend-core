const router = require('../router')
const controller = require('../../controllers/department')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get( routes.department.department, auth.authenticateToken, controller.getAllDepartmentbyCompanyId);
router.post( routes.department.department, auth.authenticateToken, controller.createDepartment);
router.put( routes.department.id, auth.authenticateToken, controller.updateDepartment);
router.delete( routes.department.id, auth.authenticateToken, controller.deleteDepartment);

module.exports = router.expressRouter;